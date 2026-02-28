type HttpVerb = "GET" | "PUT" | "POST" | "PATCH" | "DELETE";

interface MakeHttpReqOptions {
  signal?: AbortSignal;
}

export function makeHttpReq<T>(
  verb: HttpVerb,
  endpoint: string,
  input?: T,
  options?: MakeHttpReqOptions,
) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/${endpoint}`,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
          method: verb,
          signal: options?.signal,
        },
      );

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const data = await res.json();

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}
