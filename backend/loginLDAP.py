
import ldap3
from ldap3.core.exceptions import LDAPException
from ldap3 import Server, ALL
import logging
logger = logging.getLogger()

server = Server('ldap://192.168.0.10',get_info=ALL)
async def _ldap_login(username, password):
    try:
        with ldap3.Connection(server, user=username, password=password) as conn:
            # status = ldap3.Connection.extend.standard.paged_search()
            print(conn.bind())# "success" if bind is ok   
            search_base = 'dc=corpfer,dc=avi,dc=com'
            if(username=='amacias@corpfernandez.com'):
                username = "cobranzas@corpfernandez.com"
            search_filter = '(mail='+username+')'
            attrs = ['objectCategory','homephone', 'objectClass', 'cn', 'samaccountname', 'givenName', 'sn', 'displayName', 'mail', 'memberOf']
            conn.search(search_base, search_filter,search_scope='SUBTREE',
            attributes = attrs)
            projectNumber= ""
            name=""
            apellido= ""
            # Process the search results 
            for entry in conn.entries:
                print(entry.homePhone)
                # print(entry)
                projectNumber = str(entry.homePhone).replace(";",",")
                name= str(entry.givenName)
                apellido= str(entry.sn)
            if (username == 'datascience@corpfernandez.com'):
                projectNumber = projectNumber+',p12,p200'
            if (username == 'vmrobalino@corpfernandez.com'):
                projectNumber = projectNumber + ',p200'
            
            # if (username == 'digitadordistribucion@corpfernandez.com'):
            #     projectNumber =  projectNumber+',p200'
    # Do something with the user properties  
            logger.info(f"Se logueó correctamente el usuario {name} {apellido}")
            return username,name, apellido,projectNumber
    except LDAPException:
        print('Unable to connect to LDAP server')
        return False
