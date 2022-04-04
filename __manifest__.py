# -*- coding: utf-8 -*-
{
    'name': "Pos Barcode Lot",

    'summary': """ Desarrollo lectura de codigo barra y lote en POS""",

    'description': """
        Desarrollo lectura de codigo barra y lote en POS
    """,

    'author': "JS",
    'website': "",

    'category': 'Uncategorized',
    'version': '0.1',

    'depends': ['point_of_sale'],

    'data': [
        # 'views/templates.xml',
    ],
    'assets':{
        'point_of_sale.assets': [
            'pos_barcodelot/static/src/js/Screens/ProductScreen/ProductScreen.js',
        ],
        # 'web.assets_qweb':[
        #     'pos_ticket_mx/static/src/xml/**/*',
        # ],
    },
    'license': 'LGPL-3',

    'installable': True,
    'auto_install': False,
}
