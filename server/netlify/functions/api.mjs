import { Buffer } from "node:buffer";
import serverless from "serverless-http";
import app from "../../src/app.js";
import { connectDB } from "../../src/config/db.js";

const expressHandler = serverless(app);

export default async function handler(request, context) {
  await connectDB(process.env.MONGO_URI);

  const url = new URL(request.url);
  const result = await expressHandler(
    {
      httpMethod: request.method,
      path: url.pathname,
      headers: Object.fromEntries(request.headers),
      requestContext: { identity: { sourceIp: context.ip } },
      queryStringParameters: Object.fromEntries(url.searchParams),
      rawQueryString: url.search.slice(1),
      body: ["GET", "HEAD"].includes(request.method) ? null : await request.text(),
      isBase64Encoded: false
    },
    context
  );

  const headers = new Headers();
  for (const [name, value] of Object.entries(result.headers ?? {})) {
    if (value !== undefined) headers.set(name, String(value));
  }
  for (const [name, values] of Object.entries(result.multiValueHeaders ?? {})) {
    headers.delete(name);
    for (const value of values) headers.append(name, String(value));
  }

  const body = result.body
    ? result.isBase64Encoded
      ? Buffer.from(result.body, "base64")
      : result.body
    : null;
  return new Response(body, { status: result.statusCode, headers });
}

export const config = { path: ["/api/v1", "/api/v1/*"] };
