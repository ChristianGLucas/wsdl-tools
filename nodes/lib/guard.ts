// Tiny shared input-size/emptiness/nesting-depth guards used by every node in
// this package. Kept trivial and dependency-free on purpose. These run BEFORE
// any XML parsing touches the input — bounding cost on the raw text, not on
// whatever tree the parser would build from it.

export interface GuardError {
  code: string;
  message: string;
}

export function byteLength(s: string): number {
  return Buffer.byteLength(s || '', 'utf8');
}

/**
 * Reject oversized input BEFORE any parsing/allocation work touches it.
 * 3 MiB leaves headroom under the platform's ~4 MiB gRPC message cap.
 */
export function checkSize(text: string, maxBytes: number, fieldName: string): GuardError | null {
  const len = byteLength(text);
  if (len > maxBytes) {
    return {
      code: 'INPUT_TOO_LARGE',
      message: `\`${fieldName}\` is ${len} bytes, exceeding the ${maxBytes}-byte cap.`,
    };
  }
  return null;
}

export function checkEmpty(text: string, fieldName: string): GuardError | null {
  if (!text || !text.trim()) {
    return { code: 'EMPTY_INPUT', message: `\`${fieldName}\` must not be empty.` };
  }
  return null;
}

/**
 * Cheap, iterative (non-recursive) upper bound on XML tag nesting depth,
 * computed with a simple tag-scanning regex and a counter — not a real XML
 * parse. It exists purely to reject pathologically deep documents before
 * fast-xml-parser ever builds a tree from them, so a crafted "billion laughs"
 * -style deep-nesting document cannot exhaust the stack or heap inside the
 * real parser. False positives/negatives on malformed input are fine here;
 * fast-xml-parser is the source of truth for whether the document is valid
 * XML at all.
 */
export function checkDepth(xml: string, maxDepth: number, fieldName: string): GuardError | null {
  const tagRe = /<(\/?)([A-Za-z_][\w.\-:]*)[^>]*?(\/?)>/g;
  let depth = 0;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(xml)) !== null) {
    const closing = m[1] === '/';
    const selfClosing = m[3] === '/';
    if (closing) {
      depth = Math.max(0, depth - 1);
      continue;
    }
    depth += 1;
    if (depth > maxDepth) {
      return {
        code: 'NESTING_TOO_DEEP',
        message: `\`${fieldName}\` exceeds the maximum nesting depth of ${maxDepth} elements.`,
      };
    }
    if (selfClosing) depth = Math.max(0, depth - 1);
  }
  return null;
}
