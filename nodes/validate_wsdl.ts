import { WsdlInput, ValidationResult, ValidationIssue } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseWsdlDocument, WsdlModel } from './lib/wsdl';
import { localPart } from './lib/xml';

function issue(severity: 'error' | 'warning', code: string, message: string): ValidationIssue {
  const i = new ValidationIssue();
  i.setSeverity(severity);
  i.setCode(code);
  i.setMessage(message);
  return i;
}

function duplicateNames(names: string[]): string[] {
  const seen = new Set<string>();
  const dups = new Set<string>();
  for (const n of names) {
    if (!n) continue;
    if (seen.has(n)) dups.add(n);
    seen.add(n);
  }
  return [...dups];
}

function checkModel(model: WsdlModel): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const binding of model.bindings) {
    const found = model.portTypes.some((pt) => localPart(pt.name) === localPart(binding.type));
    if (!found) {
      issues.push(
        issue('error', 'BINDING_TYPE_NOT_FOUND', `Binding "${binding.name}" references type "${binding.type}", which is not declared.`)
      );
    }
  }

  for (const svc of model.services) {
    if (svc.ports.length === 0) {
      issues.push(issue('warning', 'SERVICE_HAS_NO_PORTS', `Service "${svc.name}" declares no ports/endpoints.`));
    }
    for (const port of svc.ports) {
      const found = model.bindings.some((b) => localPart(b.name) === localPart(port.binding));
      if (!found) {
        issues.push(
          issue(
            'error',
            'PORT_BINDING_NOT_FOUND',
            `Port "${port.name}" on service "${svc.name}" references binding "${port.binding}", which is not declared.`
          )
        );
      }
      if (!port.addressLocation) {
        issues.push(issue('warning', 'PORT_MISSING_ADDRESS', `Port "${port.name}" on service "${svc.name}" has no address location.`));
      }
    }
  }

  // Message references are only meaningful for WSDL 1.1, where operation
  // input/output carry a `message` QName; WSDL 2.0 references XSD elements
  // directly instead.
  if (model.version === '1.1') {
    for (const pt of model.portTypes) {
      for (const op of pt.operations) {
        for (const ref of [op.inputMessage, op.outputMessage, ...op.faultMessages]) {
          if (!ref) continue;
          const found = model.messages.some((m) => localPart(m.name) === localPart(ref));
          if (!found) {
            issues.push(
              issue(
                'error',
                'MESSAGE_NOT_FOUND',
                `Operation "${op.name}" on portType "${pt.name}" references message "${ref}", which is not declared.`
              )
            );
          }
        }
      }
    }
  }

  const dupServices = duplicateNames(model.services.map((s) => s.name));
  if (dupServices.length) issues.push(issue('warning', 'DUPLICATE_SERVICE_NAME', `Duplicate service name(s): ${dupServices.join(', ')}.`));

  const dupBindings = duplicateNames(model.bindings.map((b) => b.name));
  if (dupBindings.length) issues.push(issue('warning', 'DUPLICATE_BINDING_NAME', `Duplicate binding name(s): ${dupBindings.join(', ')}.`));

  const dupPortTypes = duplicateNames(model.portTypes.map((p) => p.name));
  if (dupPortTypes.length) issues.push(issue('warning', 'DUPLICATE_PORT_TYPE_NAME', `Duplicate portType name(s): ${dupPortTypes.join(', ')}.`));

  const dupMessages = duplicateNames(model.messages.map((m) => m.name));
  if (dupMessages.length) issues.push(issue('warning', 'DUPLICATE_MESSAGE_NAME', `Duplicate message name(s): ${dupMessages.join(', ')}.`));

  return issues;
}

/**
 * Validate basic WSDL structural correctness and report every issue found:
 * a recognizable definitions/description root exists, every service's
 * ports reference a binding that is actually declared, every binding's
 * type references a portType/interface that is actually declared, and
 * every operation's input/output/fault message reference resolves.
 * valid=true only when there are no error-severity issues (warnings do not
 * fail validity).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function validateWsdl(ax: AxiomContext, input: WsdlInput): ValidationResult {
  const result = parseWsdlDocument(input.getWsdl());
  const out = new ValidationResult();

  if (result.ok === false) {
    out.setVersion('unknown');
    out.setIssuesList([issue('error', result.error.code, result.error.message)]);
    out.setValid(false);
    return out;
  }

  out.setVersion(result.model.version);
  const issues = checkModel(result.model);
  out.setIssuesList(issues);
  out.setValid(!issues.some((i) => i.getSeverity() === 'error'));
  return out;
}
