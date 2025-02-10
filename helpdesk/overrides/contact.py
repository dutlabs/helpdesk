from frappe import _
from frappe.contacts.doctype.contact.contact import Contact


class CustomContact(Contact):
    @staticmethod
    def default_list_data():
        columns = [
            {
                "label": _("Name"),
                "type": "Data",
                "key": "full_name",
                "width": "17rem",
            },
            {
                "label": _("Email"),
                "type": "Data",
                "key": "email_id",
                "width": "24rem",
            },
            # {
            #     "label": "Phone",
            #     "type": "Data",
            #     "key": "mobile_no",
            #     "width": "12rem",
            # },
            {
                "label": _("Created On"),
                "type": "Datetime",
                "key": "creation",
                "width": "8rem",
            },
        ]
        return {"columns": columns}
