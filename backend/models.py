import datetime as _dt
from enum import unique
import json
from operator import index
import subprocess
import time
from fastapi import FastAPI, Query, Request, HTTPException, Response, status
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.encoders import jsonable_encoder
import requests as rq
from typing import Optional, List
import database as _database


from datetime import datetime
import json
import subprocess
import time
from urllib import response
from fastapi import FastAPI, Query, Request, HTTPException, Response, status,Form #library to configurate the WebApp
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.encoders import jsonable_encoder
import requests as rq
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware
import os
import logging

import sqlalchemy as _sql
import sqlalchemy.orm as _orm
import passlib.hash as _hash

import database as _database

# class UserProjectLink(_database.Base, table=True): #Get 2 variable to find the project id and user id to login the page.
#     """Class for Many-To-Many Relationship between User and Project"""
#     project_id: Optional[int] = Field(
#         default=None, foreign_key="project.id", primary_key=True)#get the project_id of the database
#     user_id: Optional[int] = Field(
#         default=None, foreign_key="user.id", primary_key=True)#get de user_id of the project


# class ProjectBase(_database.Base):
#     """Class for Project based on SQL"""
#     __tablename__ = "project" #String variable to identificate the db
#     project_name: str = Field(index=True)# get a String varibale of the object Field to keep the name the project
#     project_path: str = Field(index=True)#it the same information we do this because we will use this info on 2 different things
#     users: List["User"] = Relationship(back_populates="projects",
#                                        link_model=UserProjectLink)


# class Project(ProjectBase, table=True): # class to fill the database project information
#     """Class inheriting from ProjectBase"""
#     id: Optional[int] = Field(default=None, primary_key=True)


# class ProjectRead(ProjectBase): #class to identification a database and read it
#     """Class inheriting from ProjectBase for User to read"""
#     id: int


# class ProjectExecuted(ProjectBase):#define the class to get some variables if the project is on use
#     """Class for Project after executing its process"""
#     id: int
#     project_name: str
#     project_path: str
#     ok: bool
#     data: str
#     executed_at: datetime




# class UserBase(_database.Base):#Define the variables to use of sqlmodel
#     """Class for User based on SQL"""
#     __tablename__ = "user"
#     user_email: str = Field(index=True)
#     user_name: str
#     projects: List["User"] = Relationship(back_populates="users",
#                                           link_model=UserProjectLink)

# class UserCreate(UserBase):
#     password:str


# class User(UserBase, table=True):#Define the user class if exist a table################################################
#     """Class inheriting from UserBase"""
#     id: Optional[int] = Field(default=None, primary_key=True)


# class UserRead(UserBase): #Class to know the id like a int
#     """Class inheriting from UserBase for User to read"""
#     id: int

# async def print_request(request: Request):
#     """Async function to help reading request objects"""
#     try:
#         print(f'request header       : {dict(request.headers.items())}')
#         print(f'request query params : {dict(request.query_params.items())}')
#         print(f'request json         : {await request.json()}')
#     except Exception as err:
#         print(f'request body         : {await request.body()}')
#         print(err)

        

# async def get_project_by_id(project_id: int):
#     """Async function to retrieve Project object based on an ID"""
#     #statement = select(ProjectExecuted).where(col(Project.id) == project_id)
#     statement = select(Project).join(UserProjectLink).where(
#             col(Project.id) == project_id)
#     results = SessionLocal.exec(statement).one()
#     return  results  # SELECT PROJECT WHERE PROJEC:ID= PROJECTID
#     project: Project = SessionLocal.exec(statement).one()# get a especific information of the project# get a especific information of the project
#     print(project)
#     return project, statement
# ##############################################################

# class User(_database.Base):
#     __tablename__ = "Login"
#     id =_sql.Column(_sql.Integer, primary_key=True, index=True ) 
#     username= _sql.Column(_sql.String)
#     email= _sql.Column(_sql.String,unique=True, index=True)

#     hashed_password=_sql.Column(_sql.String)
#     project= _orm.relationship("UserProjectLink",back_populates="users")

#     def verify_password(self, password:str):
#         return _hash.bcrypt.verify(password,self.hashed_password)


# class Project(_database.Base):
#     __tablename__="project"
#     project_name= _sql.Column(_sql.String)
#     project_path=_sql.Column(_sql.String)
#     id =_sql.Column(_sql.Integer, primary_key=True, index=True ) 

# class UserProjectLink(_database.Base):
#     __tablename__="userprojectlink"
#     project_id = _sql.Column(_sql.INTEGER,_sql.ForeignKey("project.id"),primary_key=True, index=True)
#     user_id= _sql.Column(_sql.INTEGER,_sql.ForeignKey("Login.id"),primary_key=True, index=True)
#     users= _orm.relationship("User",back_populates="userprojectlink")




class User:
    def __init__(self, nombre, apellido, email, projectos):
        self.nombre = nombre
        self.apellido = apellido
        self.email = email
        self.projectos = projectos
    # # __tablename__ = "users"
    # # __table_args__ = {'extend_existing': True}
    
    # nombre = _sql.Column(_sql.String, index=True)
    # apellido = _sql.Column(_sql.String, index=True)
    # email = _sql.Column(_sql.String, unique=True, index=True)
    # # hashed_password = _sql.Column(_sql.String)


    # # project = _orm.relationship("UserProjectLink", back_populates="user_id")
    # projects= _orm.relationship("Project",secondary="projectlink",back_populates="users")

    # # def verify_password(self, password: str):
    # #     return _hash.bcrypt.verify(password, self.hashed_password)



class Project(_database.Base):
    __tablename__ = "projects"
    __table_args__ = {'extend_existing': True}
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    project_name = _sql.Column(_sql.String, index=True)
    project_path = _sql.Column(_sql.String, index=True)
    alias = _sql.Column(_sql.String, index=True)
    # users=  _orm.relationship("User",secondary="projectlink",back_populates="projects")


# class ProjectLink(_database.Base):
#     __tablename__="projectlink"
#     __table_args__ = {'extend_existing': True}
#     project_id = _sql.Column(_sql.INTEGER,_sql.ForeignKey("projects.id"),index=True)
#     # user_id= _sql.Column(_sql.INTEGER,_sql.ForeignKey("users.id"), primary_key=True,index=True)
   

class ProjectExecuted:#define the class to get some variables if the project is on use
    def __init__(self, user, project_name, project_path, ok,data,executed_at):
        self.user = user
        self.project_name = project_name
        self.project_path = project_path
        self.ok = ok
        self.data = data
        self.executed_at = executed_at
