import asyncio
import os
import subprocess
import subprocess
from concurrent.futures import ProcessPoolExecutor
from models import ProjectExecuted
from loginLDAP import _ldap_login
import fastapi as _fastapi
import fastapi.security as _security
import jwt as _jwt
import datetime as _dt
from datetime import datetime
import sqlalchemy.orm as _orm
import passlib.hash as _hash
from fastapi.encoders import jsonable_encoder
from multiprocessing import Pool
import hashlib
import database as _database, models as _models, schemas as _schemas
import logging
import json
oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")
logger = logging.getLogger()


JWT_SECRET = "myjwtsecret"


def primary_key(id):

    result = hashlib.md5(id.encode())

    return result.hexdigest()


def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)


def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_user_by_email(email: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.email == email).first()


async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    user_obj = _models.User(
        email=user.email, nombre= user.nombre, apellido=user.apellido)
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


async def authenticate_user(email: str, password:str, db: _orm.Session):

    user = await  _ldap_login(email, password)
    print(user)
    if not user:
        return False
    user = _models.User(
        email=user[0], nombre= user[1], apellido=user[2],projectos=user[3])
    # print(user.apellido)

    if not user:
        # return 1 cuando el usuario no tenga perfil creado en la pagina
        return 1
    # print(user.nombre)
    return user


async def create_token(user: _models.User):
    user_obj = _schemas.User.from_orm(user)
    token = _jwt.encode(user_obj.dict(), JWT_SECRET)

    return dict(access_token=token, token_type="bearer")


async def get_current_user(
    db: _orm.Session = _fastapi.Depends(get_db),
    token: str = _fastapi.Depends(oauth2schema),
):
    try:
        # print(token)
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        print( payload )
        user = _models.User(
        email=payload["email"], nombre= payload["nombre"], apellido=payload["apellido"],projectos=payload["projectos"])
        # user = db.query(_models.User).get(payload["id"])
    except:
        raise _fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )

    return _schemas.User.from_orm(user)


async def create_project(project: _schemas.ProjectCreate, db: _orm.Session):


    project = _models.Project(project_name=project.project_name, alias= project.alias,project_path=project.project_path)
    db.add(project)
    db.commit()
    db.refresh(project)
    return _schemas.Project.from_orm(project)


async def get_projects(
    user: _schemas.User,
    token: _orm.Session ):
    # current_user_id= str(user.id)
    list_project= str(user.projectos).split(',')
    # project_id= token.query(_models.ProjectLink.project_id).filter(_models.ProjectLink.user_id == current_user_id).all()
    # for i in project_id:
    print(list_project)
    #    list_project.append(i[0])
    project = token.query(_models.Project).filter(_models.Project.id.in_(tuple(list_project))).all()
    # print(list(map(_schemas.Project.from_orm ,project)), project_id[0],tuple(list_project))
    print(list(map(_schemas.Project.from_orm ,project)))
    return list(map(_schemas.Project.from_orm ,project))


def execute_project(project : str):
    ok = True
    stderr=""
    result=""
    response = {"model": project, "description": "Proyecto no encontrado",
                "error": 404, "error_detail": stderr,"ok":(ok)}
    try:
        recorte = str(project).split(';')
        print(recorte)
        project_path= recorte[0]
        command_promt= recorte[1]
        user = recorte[2]
        #user= 'jneira'
        project_name = project_path.split('\\')[-1]
        
        # print(str(project_path))
        environ = os.environ.copy()
        environ['PYTHONIOENCODING'] = 'utf-8'
        # Crear el comando para ejecutar el script
        command = 'conda activate ' +project_name+' & python main.py ' + command_promt
       
        try: 
            print("Command Promt: "+command_promt)

            result = subprocess.run(['cmd.exe', '/c', command], cwd=project_path,capture_output=True,env=environ,encoding='utf-8')
            logger.info(f"Ejecutando proyecto: {project_name}, Comando: {command_promt}")

            
        except Exception as e:
            print(result.stderr)

            command= ''
            result = subprocess.run(['cmd.exe', '/c', command], cwd=project_path,capture_output=True,env=environ,encoding='utf-8')

            
        stderr=result.stderr
        stdout=result.stdout
        print(stdout)
        # stderr=''
        # print(result)
     
    except subprocess.CalledProcessError as error:
        errorMessage =  str(error.output)
        stderr = errorMessage
        print("Error: " + errorMessage)
        stderr= str(error.output)
        logger.error(f"Error en la ejecución del proyecto: {project_name}, Error: {stderr}")


        ok=False
    if stderr == '':
        # filename: str = output.splitlines()[-1:][0]
        project_name = project_path.split('\\')[-1]
        # print(project_name)
        project_dict = {}
        project_dict['user']= user
        project_dict['project_name']= project_name
        project_dict['project_path'] = project_path
        project_dict['ok'] = str(True)
        project_dict['data'] = stdout
        project_dict['executed_at'] = _dt.datetime.now()
        

        response : ProjectExecuted = _models.ProjectExecuted(**project_dict
                                )
        print(response.ok)

    else:
        ok = False
        response = {"model": project, "description": "Proyecto no encontrado",
                    "error": 404, "error_detail": stderr,"ok":ok}
    try:
        json_response = jsonable_encoder(response)
        response_str = json.dumps(json_response, indent=4)
        logger.info(f"Resultado de la ejecución: {response_str}")


        # print("json_response:", json_response)
    except Exception as e:
        print("exception:", e)
    return response



async def get_project_selector(project_id: int, user: _schemas.User, db: _orm.Session,command: str):
    project = (
        db.query(_models.Project).filter( _models.Project.id == project_id).first()
    )


    # print(project) 
    print(_dt.datetime.now())
    if project is None:
        raise _fastapi.HTTPException(status_code=404, detail="El projecto no se encuentra disponible")


    loop = asyncio.get_event_loop()
    print("started")
    result_execute= []
    command= command.replace('|','/')
    logger.info(f"Obteniendo proyecto: {project.project_name} (ID: {project_id})")

    with ProcessPoolExecutor(5) as pool:
        name= str(user.email).split('@')[0]
        tasks = [loop.run_in_executor(pool, execute_project, str(project.project_path)+";"+command+";"+name) for i in range(1)]
        try:
            await asyncio.gather(*tasks)
            for exec in tasks:
                
                result_execute.append(exec.result())
            print("Completely done")
            logger.info(f"Ejecutando proyecto en segundo plano: {project.project_name}, Comando: {command}")

            # Convertir el resultado de la ejecución a un diccionario serializable
            result_dict_list = [jsonable_encoder(result) for result in result_execute]

            # Convertir el resultado en una cadena JSON para registro
            result_str = json.dumps(result_dict_list, indent=4)
            logger.info(f"Resultado de la ejecución:\n{result_str}")

            return result_execute

        except Exception as e:
            print(f"An exception occurred: {e}")
            for task in tasks:
                task.cancel()
            await asyncio.gather(*tasks, return_exceptions=True)


