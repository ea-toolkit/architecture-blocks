import { XMLParser, XMLValidator } from "fast-xml-parser";

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateDrawioXml(xml: string): ValidationResult {
  const syntaxResult = XMLValidator.validate(xml);
  if (syntaxResult !== true) {
    return {
      valid: false,
      error: `XML syntax error: ${syntaxResult.err.msg} at line ${syntaxResult.err.line}`,
    };
  }

  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);

  if (!parsed.mxfile) {
    return {
      valid: false,
      error: "Missing <mxfile> root element",
    };
  }

  return { valid: true };
}

export function validateBeforeWrite(
  originalXml: string,
  modifiedXml: string,
): ValidationResult {
  const result = validateDrawioXml(modifiedXml);
  if (!result.valid) {
    return {
      valid: false,
      error: `Modified XML is invalid: ${result.error}`,
    };
  }

  if (modifiedXml.trim().length === 0) {
    return {
      valid: false,
      error: "Modified XML is empty",
    };
  }

  return { valid: true };
}
