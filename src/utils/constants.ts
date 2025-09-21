export const Server_URL = process.env.SERVER_URL || "http://localhost:3005";
export const API_VERSION = process.env.API_VERSION || "v1";
export const MESSAGES_TO_LOAD = 15;

export const gridData = [
  {
    headImage: "/purple.png",
    heading: "Start-Ups",
    headingDesc: "(for one developer)",
    description:
      "A recommended single license for solo designers & developers building high-end AI projects & applications.",
    packagePrice: "$29",
    packageDiscount: false,
    packagePayment: "one-time payment",
    packageTax: "VAT taxes included",
    button: "Get started now with Horizon AI",
    priceId: "price_1Q2UN7JP2P7GaukU9YB9s9qe",
    productId: "prod_QtyAT2cwu907ls",
  },
  {
    headImage: "/purple.png",
    heading: "Start-Ups",
    headingDesc: "(for one developer)",
    description:
      "A recommended single license for solo designers & developers building high-end AI projects & applications.",
    packagePrice: "$49",
    packageDiscount: false,
    packagePayment: "one-time payment",
    packageTax: "VAT taxes included",
    button: "Get started now with Horizon AI",
    priceId: "price_1Q2UN8JP2P7GaukUS7XhooyB",
    productId: "prod_QtyAzzq1FoMo2t",
  },
];

export const activities = [
  {
    title: "Client Meeting",
    description: "New project started",
    time: "1 hour ago",
  },
  {
    title: "Team Standup",
    description: "Discussed weekly goals",
    time: "2 hours ago",
  },
  {
    title: "Design Review",
    description: "Reviewed UI designs",
    time: "3 hours ago",
  },
];
import {
  Settings,
  Bot,
  MessageSquare,
  Users,
  Zap,
  Clock,
  Shield,
  Globe,
} from "lucide-react";
export const tabs = [
  {
    id: "general",
    name: "General",
    icon: Settings,
    description: "Basic configuration and AI model settings",
  },
  {
    id: "behavior",
    name: "Behavior",
    icon: Bot,
    description: "Conversation policies and response behavior",
  },
  {
    id: "widget",
    name: "Widget",
    icon: MessageSquare,
    description: "Chat widget appearance and functionality",
  },
  {
    id: "routing",
    name: "Routing",
    icon: Users,
    description: "Escalation and routing preferences",
  },
  {
    id: "tools",
    name: "Tools",
    icon: Zap,
    description: "Available integrations and capabilities",
  },
  {
    id: "hours",
    name: "Working Hours",
    icon: Clock,
    description: "Business hours and availability",
  },
];
export const toolIcons = {
  search: {
    icon: Globe,
    name: "Web Search",
    description: "Search the web for real-time information",
  },
  escalate: {
    icon: Users,
    name: "Human Escalation",
    description: "Allow escalation to human agents when needed",
  },
  lead_form: {
    icon: MessageSquare,
    name: "Lead Forms",
    description: "Collect and manage lead information",
  },
  knowledge_base: {
    icon: Shield,
    name: "Knowledge Base",
    description: "Access internal knowledge base and documentation",
  },
  calendar: {
    icon: Clock,
    name: "Calendar",
    description: "Schedule appointments and manage bookings",
  },
};

export const numericDayNames: { [key: number]: string } = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};
