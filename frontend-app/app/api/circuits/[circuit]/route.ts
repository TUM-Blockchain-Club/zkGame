import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export default async function GET(request: Request, { params }: { params: { circuit: string } }) {
  const circuit = params.circuit;
  try {
    const projectRoot = process.cwd();
    const filePath = path.join(projectRoot, 'circuits', circuit, 'src/main.nr');
    const data = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json({ data });
  } catch (error) {
    // error code 500
    return NextResponse.error();
  }
}
