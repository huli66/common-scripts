/**
 * 使用原生压缩和转换
 * 可以考虑 protobuf 转提高性能
 * 可以考虑 rsa 加密
 */

const compress = async (data: any) => {
  try {
    const jsonStr = JSON.stringify(data);

    const stream = new CompressionStream("gzip");
    const writer = stream.writable.getWriter();
    const text = new TextEncoder().encode(jsonStr); // 转换为 Uint8Array
    writer.write(text);
    writer.close();
    const compressed = await new Response(stream.readable).arrayBuffer(); // 转换为 二进制
    return compressed;
  } catch (error) {
    console.error("compress error", error);
    return null;
  }
};

const decompress = async (data: any) => {
  try {
    const decompStream = new DecompressionStream("gzip");
    const writer = decompStream.writable.getWriter();
    writer.write(new Uint8Array(data));
    writer.close();
    const result = await new Response(decompStream.readable).text();
    return JSON.parse(result);
  } catch (error) {
    console.error("decompress error", error);
    return null;
  }
};

export {compress, decompress};
