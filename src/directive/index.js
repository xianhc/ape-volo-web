import { hasPerm, hasRole } from './permission'

export function setupDirective(app) {
  app.directive('hasRole', hasRole)
  app.directive('hasPerm', hasPerm)
}
