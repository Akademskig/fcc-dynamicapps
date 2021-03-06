import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import { googleApiRoutes, userRoutes, authRoutes, placesRoutes } from './routes'

export class WebServer {

	constructor(log, config) {
		this.log = log
		this.config = config
	}

	async init() {
		const app = express()

		app.use(bodyParser.json())
		app.use(bodyParser.urlencoded({ extended: true }))
		app.use(cookieParser())
		app.use(compress())
		// secure apps by setting various HTTP headers
		app.use(helmet())
		// enable CORS - Cross Origin Resource Sharing
		app.use(cors())
		const CURRENT_WORKING_DIR = process.cwd()
		app.use(express.static(path.join(CURRENT_WORKING_DIR, 'client/build')));

		app.use('/api', googleApiRoutes, userRoutes, authRoutes, placesRoutes)
		app.get('*', (req, res) => {
			res.sendFile(path.join(CURRENT_WORKING_DIR, 'client/build', 'index.html'));
		});
		app.listen(this.config.port, () => {
			this.log.blue(`Web server started on port ${this.config.port}.`)
		})
	}
}



