import { MediaConvert } from 'aws-sdk';
import Serverless from 'serverless';

export class ServerlessMediaConvertPlugin {
	private readonly serverless: Serverless;
	protected configurationVariablesSources: any;

	constructor(serverless: Serverless) {
		this.serverless = serverless;

		this.configurationVariablesSources = {
			mediaConvert: {
				resolve: this.resolveVariable.bind(this),
			},
		};
	}

	async resolveVariable({ address }: { address: string }) {
		if (address === 'endpoint') {
			try {
				const mediaConvert = new MediaConvert();
				const data = await mediaConvert.describeEndpoints({}).promise();
				const endpoint = data.Endpoints[0].Url;
				this.serverless.cli.log(`MediaConvert endpoint resolved to: ${endpoint}`);
				return { value: endpoint };
			} catch (error) {
				this.serverless.cli.log(`Failed to resolve MediaConvert endpoint: ${error.message}`);
				throw error;
			}
		} else {
			throw new Error(`Unsupported address "${address}"`);
		}
	}
}

module.exports = ServerlessMediaConvertPlugin;
