import { IRoute } from "@/types/navigation";

// NextJS Requirement
export const isWindowAvailable = () => typeof window !== "undefined";

export const findCurrentRoute = (routes: IRoute[]): IRoute | undefined => {
  const foundRoute: IRoute | undefined = routes.find(
    (route) =>
      isWindowAvailable() &&
      route.path &&
      window.location.href.indexOf(route.path) !== -1 &&
      route
  );

  return foundRoute;
};

export const getActiveRoute = (routes: IRoute[]): string => {
  const route = findCurrentRoute(routes);
  return route?.name || "Default Brand Text";
};

export const getActiveNavbar = (routes: IRoute[]): boolean => {
  const route = findCurrentRoute(routes);
  // return route?.secondary;
  // return route && route.secondary === true;

  return route?.secondary ?? false;
};

export const getActiveNavbarText = (routes: IRoute[]): string | boolean => {
  return getActiveRoute(routes) || false;
};
