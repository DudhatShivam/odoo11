# Odoo11 中文自定义搜索日期
# author Kalway Alan(1091333687@qq.com)
# website https://www.kalway.ltd 

{
    'name': 'search date',
    'description': 'odoo11自定义日期搜索(中文)',
    'author': 'Alan',
    'website': 'https://www.kalway.ltd ',
    'category': 'web',
    'version': '1.0.1',
    'depends': ['web'],
    'data': ['views/load.xml'],
    'qweb': ['static/src/xml/search_date.xml'],
    'installable': True,
    'application': False,
    'auto_install': False,
    'price': 'Free',
}