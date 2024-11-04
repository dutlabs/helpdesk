import frappe
from frappe import _

OPTIONS = {
    0.2: [_("Response did not help"), _("No resolution provided")],
    0.4: [_("Delayed response time"), _("Adequate help, bit slow")],
    0.6: [_("Clear guidance given"), _("Helpful answers, reasonable wait")],
    0.8: [_("Quick and precise solutions"), _("Prompt, informative support")],
    1.0: [_("Exceptional support experience"), _("Instant, top-notch help")],
}


def create_ticket_feedback_options():
    for rating in OPTIONS:
        for label in OPTIONS[rating]:
            doc = {
                "doctype": "HD Ticket Feedback Option",
                "rating": rating,
                "label": _(label),
            }
            if not frappe.db.exists(doc):
                frappe.get_doc(doc).insert()
