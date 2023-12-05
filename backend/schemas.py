import datetime as _dt
import pydantic as _pydantic

# class _UserBase(_pydantic.BaseModel):
#     email:str
#     user_name:str
#     id: int


# class UserCreate(_UserBase):
#     hashed_password:str
#     class Config:
#         orm_mode=True

# class User(_UserBase):
    
#     class Config:
#         orm_mode=True


# class _ProjectBase():
#     user_project:str
#     project_path: str

# class ProjectCreate(_ProjectBase):
#     pass


# class Project(_ProjectBase):
#     id:int
#     class Config:
#         orm_mode=True


class _UserBase(_pydantic.BaseModel):
    email: str
    nombre: str
    apellido: str
    projectos: str


class UserCreate(_UserBase):
    pass
    class Config:
        orm_mode = True


class User(_UserBase):
    email: str
    projectos:str
    class Config:
        orm_mode = True


class _ProjectBase(_pydantic.BaseModel):
    project_name: str
    project_path: str
    
    


class ProjectCreate(_ProjectBase):
    pass


class Project(_ProjectBase):
    id: str
    alias: str
    class Config:
        orm_mode = True


class ExcelRequestInfo(_pydantic.BaseModel):
    client_id: str



#########
class _ProjectLinkBase(_pydantic.BaseModel):
    user_id: int
    
    


class ProjectLinkCreate(_ProjectLinkBase):
    pass
    class Config:
        orm_mode = True

class ProjectLink(_ProjectLinkBase):
    project_id: int


    class Config:
        orm_mode = True