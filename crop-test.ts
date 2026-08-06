import fs from 'fs';
import { cropPages } from './src/lib/pdf-operations';

async function run() {
  const buf = fs.readFileSync('tests/e2e/fixtures/cg-brsvie.pdf');
  const out = await cropPages(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), [1], {
    cropMargins: { top: 10, right: 10, bottom: 10, left: 10 }
  });
  fs.writeFileSync('out.pdf', Buffer.from(out));
  console.log('Saved to out.pdf');
}
run();
