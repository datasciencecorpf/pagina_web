from datetime import datetime
import json
from fastapi.responses import FileResponse
from urllib import response
from fastapi import Request, File, UploadFile
from loginLDAP import _ldap_login
from fastapi import Depends,status
from fastapi import BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi_login.exceptions import InvalidCredentialsException
from fastapi.responses import RedirectResponse,HTMLResponse
from fastapi_login import LoginManager
from database import *
import os
import logging
import fastapi as _fastapi
import fastapi.security as _security
import sqlalchemy.orm as _orm
import services as _services, schemas as _schemas
import models as _models
from typing import List
import uvicorn
import pandas as pd
from urllib.parse import unquote
import ast 
import shutil
current_Date = datetime.today().strftime('%d-%b-%Y-%H-%M-%S')
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

templates = Jinja2Templates(directory="front/templates")

log_filename = 'std-' + current_Date + '.log'
logging.basicConfig(filename=ROOT_DIR + '/logs/' + log_filename, filemode='w',
                    format='%(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
logger.info("This is just an information for you")


UPLOAD_FOLDER = "uploads"  # Carpeta de destino para almacenar los archivos
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# fill the variable to use in the progranm

# sqlite_file_name = "database.db" #fill the information of database
# sqlite_url = f"sqlite:///{sqlite_file_name}" #get a url to use in the web site
# engine = create_engine(sqlite_url) #Keep the functoin of engine in the variable to use 
# SessionLocal = Session(bind=engine) #keep the function of Session to open the engine function
# app = FastAPI() #Keep the function to use 
# templates = Jinja2Templates(directory="templates")
# #we have to make a standar variables to use, because we wil use to many times.

# templates = Jinja2Templates(directory="front/templates")
# Azure App Credentials 
CLIENT_ID = "653e5348-2ca4-48e1-abd2-8413cf437eee"

CLIENT_SECRET = "3YI8Q~OVUJX3SKiriC6SgrIOZdIQwJ8lkInq6amX"
AUTHORITY = "https://login.microsoftonline.com/common"
API_LOCATION = "http://localhost:8000"
TOKEN_ENDPOINT = "/get_auth_token"
SCOPE = ["User.ReadBasic.All"]


class NotAuthenticatedException(Exception):
    pass
SECRET = "super-secret-key"
manager = LoginManager(SECRET, '/auth/login', use_cookie=True, custom_exception=NotAuthenticatedException)
app = _fastapi.FastAPI()

@manager.user_loader()
async def load_user(username:str, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    user =  await _services.get_user_by_email(username, db)
    return user



# se obtiene el token del usuario logueado
@app.post("/api/token")
async def generate_token(
    form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    user = await _services.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise _fastapi.HTTPException(status_code=401, detail="Invalid Credentials")
    if user ==1:
        raise _fastapi.HTTPException(status_code=401, detail="Este usuario no cuenta con un perfil en la pagina web")

    
    return await _services.create_token(user)


@app.get("/private")
def getPrivateendpoint():
    return "You are an authentciated user"

# Obtiene informacion acerca del usuario logueado
@app.get("/api/users/me", response_model=_schemas.User)
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user



@app.post("/api/projects", response_model=_schemas.Project)
async def create_project(
    project: _schemas.ProjectCreate,
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):

    return await _services.create_project(project=project, db=db)

# se obtiene la lista de proyectos por usuario
@app.get("/api/projects", response_model=List[_schemas.Project])
async def get_projects(
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_projects(user=user,token=db)


# Ejecuta el proyecto, permitiendole añadir comentarios
@app.get("/api/projects/{project_id}/{command}", status_code=200)
async def get_project_selector(
    project_id: str,
    command : str,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    
    db: _orm.Session = _fastapi.Depends(_services.get_db),

    
):
    command_decode = unquote(command)
    
    return await (_services.get_project_selector(project_id,user=user,db=db,command=command_decode) )
 

##################################
@app.get("/api")
async def root():
    return {"message":"Fernández - Data Science"} 


@app.post("/return_excel_file/{file_path}")

async def serve_excel(file_path:str):
    file_name= file_path.split('\\')[-1]
    headers = {'Content-Disposition': 'attachment; filename='+file_name}
    file_path=os.path.abspath(file_path)
    print(file_path)
    return FileResponse(
            file_path,
        # Swagger UI says 'cannot render, look at console', but console shows nothing.
        headers=headers)


# Route to obtain ips from all warehouses 
@app.get("/read_locales")
async def read_locales():
    Ip_Sucursal = pd.read_excel(os.path.abspath( "Ips locales.xlsx"), sheet_name="Hoja1", dtype={'No_Sucursal': str})
    return Ip_Sucursal[["Sucursal","No_Sucursal"]].set_index('No_Sucursal').to_json()

# Route to save 
@app.post("/save_insert/{json_str}/{nombre}")
async def save_json(json_str,nombre):
    data = ast.literal_eval(json_str)
        # Datos = json.loads((Datos))#json.loads(str(Datos).replace("'", '"')
        # Guardar el diccionario en un archivo JSON
    with open(nombre, 'w') as file:
        json.dump(data, file)


@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as file_object:
        shutil.copyfileobj(file.file, file_object)

    return {"filename": file.filename, "file_path": file_path}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3002)
