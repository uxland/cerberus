export interface Route {
  path: string;
  element?: React.FC;
  children?: Route[];
}
