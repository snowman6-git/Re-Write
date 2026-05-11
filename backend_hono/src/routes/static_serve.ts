import axios from "axios";
import * as dotenv from "dotenv";

// hono
import { Context } from "hono";

dotenv.config();

export async function image(c: Context) {
  const filename: string = c.req.param('filename')!

  const jiral_no = !/[\.]{2,}|[\/\\]/.test(filename) //.이 두개거나, /or\가 파라미터에 있다면 true /양옆에 안하면 씹힘
  if(jiral_no){
    return new Response(file(path.join(__dirname, `../images/${filename}`)));
  } else { return new Response(file(path.join(__dirname, '../images/don.webp'))) } //자신이 원하는 비정상 접근 대응
}