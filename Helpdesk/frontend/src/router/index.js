import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated, isAdmin, isEmployee, isCustomer } from "../helpers";

// Components
import Login from "../components/Login.vue";
import CustomerPortal from "../components/CustomerPortal.vue";
import EmployeeDashboard from "../components/EmployeeDashboard.vue";
import AdminDashboard from "../components/AdminDashboard.vue";
import IssueDetail from "../components/IssueDetail.vue";
import NewIssue from "../components/NewIssue.vue";
import EditIssue from "../components/EditIssue.vue";
import UserManagement from "../components/UserManagement.vue";
import Messages from "../components/Messages.vue";

const routes = [
  // Public routes
  { path: "/login", component: Login, meta: { requiresAuth: false } },

  // Customer routes
  {
    path: "/",
    component: CustomerPortal,
    meta: { requiresAuth: true, roles: ['customer'] }
  },
  {
    path: "/issue/:id",
    component: IssueDetail,
    meta: { requiresAuth: true, roles: ['customer'] }
  },

  // Employee routes
  {
    path: "/employee",
    component: EmployeeDashboard,
    meta: { requiresAuth: true, roles: ['employee'] }
  },
  {
    path: "/employee/messages",
    component: Messages,
    meta: { requiresAuth: true, roles: ['employee'] }
  },

  // Admin routes
  {
    path: "/admin",
    component: AdminDashboard,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: "/admin/issues",
    component: AdminDashboard,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: "/admin/issues/new",
    component: NewIssue,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: "/admin/issues/edit/:id",
    component: EditIssue,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: "/admin/users",
    component: UserManagement,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: "/admin/messages",
    component: Messages,
    meta: { requiresAuth: true, roles: ['admin'] }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  console.log('🔍 Route guard:', to.path);
  console.log('  requiresAuth:', to.meta.requiresAuth);
  console.log('  isAuthenticated:', isAuthenticated());
  console.log('  allowedRoles:', to.meta.roles);
  
  const requiresAuth = to.meta.requiresAuth !== false;
  const allowedRoles = to.meta.roles;

  if (requiresAuth && !isAuthenticated()) {
    console.log('  ❌ Not authenticated, redirecting to /login');
    next('/login');
    return;
  }

  if (allowedRoles && !allowedRoles.some(role =>
    (role === 'admin' && isAdmin()) ||
    (role === 'employee' && isEmployee()) ||
    (role === 'customer' && isCustomer())
  )) {
    console.log('  ❌ Role check failed, redirecting');
    // Redirect to appropriate dashboard
    if (isAdmin()) next('/admin');
    else if (isEmployee()) next('/employee');
    else if (isCustomer()) next('/');
    else next('/login');
    return;
  }

  console.log('  ✅ Access granted');
  next();
});

export default router;