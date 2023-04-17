interface APIGatewayProxyEvent {
  headers: Record<string, string>;
  body: string;
  isBase64Encoded: boolean;
}

export const handler = async (event: APIGatewayProxyEvent) => {
  return { hello: 'world' };
};
