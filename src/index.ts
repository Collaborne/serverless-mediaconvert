import { MediaConvert } from 'aws-sdk';
import Serverless, { Options } from 'serverless';

export default class ServerlessMediaConvertEndpointPlugin {
	private readonly serverless: Serverless;
	private readonly options: Options;

	constructor(serverless: Serverless, options: Options) {
		this.serverless = serverless;
		this.options = options;

		const variables = (this.serverless.variables as any);
		variables['resolveVariable'] = this.resolveVariable.bind(this);
		variables['resolveVariableSyntax'] = /\${mediaConvert:endpoint}/g;
	}

	async resolveVariable(variableString: string) {
		if (variableString === 'mediaConvert:endpoint') {
			try {
				const mediaConvert = new MediaConvert();
				const data = await mediaConvert.describeEndpoints({}).promise();
				const endpoint = data.Endpoints[0].Url;
				this.serverless.cli.log(`MediaConvert endpoint resolved to: ${endpoint}`);
				return endpoint;
			} catch (error) {
				this.serverless.cli.log(`Failed to resolve MediaConvert endpoint: ${error.message}`);
				throw error;
			}
		}
	}
}
