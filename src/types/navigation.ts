import { ReactElement } from "react";

export interface IRoute {
  name: string;
  layout?: string;
  path?: string;
  icon?: ReactElement;
  component?: React.ComponentType;
  secondary?: boolean;
  children?: Omit<IRoute, "children" | "icon">[];
}
