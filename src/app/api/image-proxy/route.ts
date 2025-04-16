export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
  
    if (!url) {
      return new Response("Missing or invalid URL", { status: 400 });
    }
  
    try {
      const response = await fetch(url);
      const contentType = response.headers.get("content-type") || "image/jpeg";
      const buffer = await response.arrayBuffer();
  
      return new Response(Buffer.from(buffer), {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch (err) {
      console.error(err);
      return new Response("Failed to fetch image", { status: 500 });
    }
  }
  