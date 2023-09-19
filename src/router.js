import { createWebHistory, createRouter } from "vue-router";
import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
// lazy-loaded
const Profile = () => import("./components/Profile.vue")
const BoardAdmin = () => import("./components/BoardAdmin.vue")
const BoardUser = () => import("./components/BoardUser.vue")

const ListDocument = () => import('./components/ListDocument.vue')
const DocumentInfo = () => import('./components/DocumentInfo.vue')

const Order = () => import('./components/Order.vue')
const RequestToDirector = () => import('./components/RequestToDirector.vue')
const AssignEmployee = () => import('./components/AssignEmployee.vue')

const WorkUser = () => import('./components/WorkUser.vue')

const ReassignWork = () => import('./components/ReassignWork.vue')

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/profile",
    name: "profile",
    // lazy-loaded
    component: Profile,
  },
  {
    path: "/admin",
    name: "admin",
    // lazy-loaded
    component: BoardAdmin,
  },
  {
    path: "/user",
    name: "user",
    // lazy-loaded
    component: BoardUser,
  },
  {
    path: "/list-document",
    alias: '/list-document',
    name: "list-document",
    component: ListDocument
  },
  {
    path: "/document-info/:id_document",
    name: "document-info",
    component: DocumentInfo
  },
  {
    path: "/order",
    name: "order",
    component: Order
  },
  {
    path: "/assign-employee/:id_document",
    name: "assign-employee",
    component: AssignEmployee
  },
  {
    path: "/work-user",
    name: "work-user",
    component: WorkUser
  },
  {
    path: "/reassing-work/:id_document",
    name: "reassing-work",
    component: ReassignWork
  },
  {
    path: "/request-to-director",
    name: "request-to-director",
    component: RequestToDirector
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;