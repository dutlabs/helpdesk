import LucideBookOpen from "~icons/lucide/book-open";
import LucideCloudLightning from "~icons/lucide/cloud-lightning";
import LucideContact2 from "~icons/lucide/contact-2";
import LucideTicket from "~icons/lucide/ticket";
import LucideUser from "~icons/lucide/user";
import LucideUserCircle2 from "~icons/lucide/user-circle-2";
import LucideUsers from "~icons/lucide/users";
import {
  AGENT_PORTAL_AGENT_LIST,
  AGENT_PORTAL_CONTACT_LIST,
  AGENT_PORTAL_CUSTOMER_LIST,
  AGENT_PORTAL_TEAM_LIST,
  AGENT_PORTAL_TICKET_LIST,
} from "@/router";

export const agentPortalSidebarOptions = [
  {
    label: __("Tickets"),
    icon: LucideTicket,
    to: AGENT_PORTAL_TICKET_LIST,
  },
  {
    label: __("Agents"),
    icon: LucideUser,
    to: AGENT_PORTAL_AGENT_LIST,
  },
  {
    label: __("Knowledge base"),
    icon: LucideBookOpen,
    to: "DeskKBHome",
  },
  {
    label: __("Teams"),
    icon: LucideUsers,
    to: AGENT_PORTAL_TEAM_LIST,
  },
  {
    label: __("Canned responses"),
    icon: LucideCloudLightning,
    to: "CannedResponses",
  },
  {
    label: __("Customers"),
    icon: LucideUserCircle2,
    to: AGENT_PORTAL_CUSTOMER_LIST,
  },
  {
    label: __("Contacts"),
    icon: LucideContact2,
    to: AGENT_PORTAL_CONTACT_LIST,
  },
];

export const customerPortalSidebarOptions = [
  {
    label: __("Tickets"),
    icon: LucideTicket,
    to: "TicketsCustomer",
  },
  {
    label: __("Knowledge base"),
    icon: LucideBookOpen,
    to: "KnowledgeBasePublicNew",
  },
];
