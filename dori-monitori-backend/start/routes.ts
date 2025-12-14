/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import TracingsController from '#controllers/tracings_controller'
import UsersController from '#controllers/users_controller'
import ProjectsController from '#controllers/projects_controller'
import UserProjectsController from '#controllers/user_projects_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import LoginController from '#controllers/login_controller'
import DashboardController from '#controllers/dashboard_controller'

import SetupController from '#controllers/setup_controller'

router.post('/setup', [SetupController, 'store'])
router.resource('/auth', LoginController)
router.resource('/tracings', TracingsController).use(['index', 'destroy'], middleware.auth())
router.resource('/users', UsersController).use('*', middleware.auth())
router.resource('/projects', ProjectsController).use('*', middleware.auth())
router.resource('/user-projects', UserProjectsController).use('*', middleware.auth())
router.resource('/dashboard', DashboardController).use('*', middleware.auth())