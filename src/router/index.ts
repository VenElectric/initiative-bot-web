import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import { UserState } from "../firesinit";
import Login from "../views/Login.vue";
import MonsterList from "../views/MonsterList.vue";
import GameSession from "../views/GameSession.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: MonsterList,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { loggedout: true },
  },
  {
    path: "/session/:id",
    name: "GameSession",
    component: GameSession,
    meta: { loggedin: false },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const userstate = await UserState();
  const loggedin = to.matched.some((routepath) => routepath.meta.loggedin);
  const loggedout = to.matched.some((routepath) => routepath.meta.loggedout);

  if (!userstate && loggedin) next("/");
  else if (userstate && loggedout) next("/");
  else next();
});

export default router;
