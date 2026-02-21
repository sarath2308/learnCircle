import {
  SSMClient,
  GetParametersByPathCommand,
  Parameter,
  GetParametersByPathCommandOutput,
} from "@aws-sdk/client-ssm";

const client = new SSMClient({ region: process.env.AWS_REGION || "ap-south-1" });

export async function loadConfigFromSSM(env: "dev" | "prod") {
  const path = `/learncircle/${env}/`;

  let nextToken: string | undefined = undefined;
  let allParams: Parameter[] = [];

  try {
    do {
      const command = new GetParametersByPathCommand({
        Path: path,
        WithDecryption: true,
        Recursive: true,
        NextToken: nextToken,
      });

      const response: GetParametersByPathCommandOutput = await client.send(command);

      if (response.Parameters) {
        allParams.push(...response.Parameters);
      }

      nextToken = response.NextToken;
    } while (nextToken);

    if (allParams.length === 0) {
      throw new Error(`No parameters found in SSM at path ${path}`);
    }

    for (const param of allParams) {
      const key = param.Name!.split("/").pop()!;
      // Don't blindly override if already set (optional but smart)
      if (!process.env[key]) {
        process.env[key] = param.Value!;
      }
    }
  } catch (err) {
    throw new Error(`Failed to load SSM params from ${path}: ${String(err)}`);
  }
}
