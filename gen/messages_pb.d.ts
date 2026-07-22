// package: christiangeorgelucas.wsdl_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class WsdlInput extends jspb.Message {
  getWsdl(): string;
  setWsdl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WsdlInput.AsObject;
  static toObject(includeInstance: boolean, msg: WsdlInput): WsdlInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WsdlInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WsdlInput;
  static deserializeBinaryFromReader(message: WsdlInput, reader: jspb.BinaryReader): WsdlInput;
}

export namespace WsdlInput {
  export type AsObject = {
    wsdl: string,
  }
}

export class Port extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getBinding(): string;
  setBinding(value: string): void;

  getAddressLocation(): string;
  setAddressLocation(value: string): void;

  getTransport(): string;
  setTransport(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Port.AsObject;
  static toObject(includeInstance: boolean, msg: Port): Port.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Port, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Port;
  static deserializeBinaryFromReader(message: Port, reader: jspb.BinaryReader): Port;
}

export namespace Port {
  export type AsObject = {
    name: string,
    binding: string,
    addressLocation: string,
    transport: string,
  }
}

export class ServiceInfo extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  clearPortsList(): void;
  getPortsList(): Array<Port>;
  setPortsList(value: Array<Port>): void;
  addPorts(value?: Port, index?: number): Port;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceInfo): ServiceInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceInfo;
  static deserializeBinaryFromReader(message: ServiceInfo, reader: jspb.BinaryReader): ServiceInfo;
}

export namespace ServiceInfo {
  export type AsObject = {
    name: string,
    portsList: Array<Port.AsObject>,
  }
}

export class ServicesResult extends jspb.Message {
  clearServicesList(): void;
  getServicesList(): Array<ServiceInfo>;
  setServicesList(value: Array<ServiceInfo>): void;
  addServices(value?: ServiceInfo, index?: number): ServiceInfo;

  getVersion(): string;
  setVersion(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServicesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ServicesResult): ServicesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServicesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServicesResult;
  static deserializeBinaryFromReader(message: ServicesResult, reader: jspb.BinaryReader): ServicesResult;
}

export namespace ServicesResult {
  export type AsObject = {
    servicesList: Array<ServiceInfo.AsObject>,
    version: string,
    error: string,
  }
}

export class Endpoint extends jspb.Message {
  getServiceName(): string;
  setServiceName(value: string): void;

  getPortName(): string;
  setPortName(value: string): void;

  getBinding(): string;
  setBinding(value: string): void;

  getAddressLocation(): string;
  setAddressLocation(value: string): void;

  getTransport(): string;
  setTransport(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Endpoint.AsObject;
  static toObject(includeInstance: boolean, msg: Endpoint): Endpoint.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Endpoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Endpoint;
  static deserializeBinaryFromReader(message: Endpoint, reader: jspb.BinaryReader): Endpoint;
}

export namespace Endpoint {
  export type AsObject = {
    serviceName: string,
    portName: string,
    binding: string,
    addressLocation: string,
    transport: string,
  }
}

export class EndpointsResult extends jspb.Message {
  clearEndpointsList(): void;
  getEndpointsList(): Array<Endpoint>;
  setEndpointsList(value: Array<Endpoint>): void;
  addEndpoints(value?: Endpoint, index?: number): Endpoint;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EndpointsResult.AsObject;
  static toObject(includeInstance: boolean, msg: EndpointsResult): EndpointsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EndpointsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EndpointsResult;
  static deserializeBinaryFromReader(message: EndpointsResult, reader: jspb.BinaryReader): EndpointsResult;
}

export namespace EndpointsResult {
  export type AsObject = {
    endpointsList: Array<Endpoint.AsObject>,
    error: string,
  }
}

export class OperationSummary extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getInputMessage(): string;
  setInputMessage(value: string): void;

  getOutputMessage(): string;
  setOutputMessage(value: string): void;

  clearFaultMessagesList(): void;
  getFaultMessagesList(): Array<string>;
  setFaultMessagesList(value: Array<string>): void;
  addFaultMessages(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OperationSummary.AsObject;
  static toObject(includeInstance: boolean, msg: OperationSummary): OperationSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OperationSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OperationSummary;
  static deserializeBinaryFromReader(message: OperationSummary, reader: jspb.BinaryReader): OperationSummary;
}

export namespace OperationSummary {
  export type AsObject = {
    name: string,
    inputMessage: string,
    outputMessage: string,
    faultMessagesList: Array<string>,
  }
}

export class PortTypeInfo extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  clearOperationsList(): void;
  getOperationsList(): Array<OperationSummary>;
  setOperationsList(value: Array<OperationSummary>): void;
  addOperations(value?: OperationSummary, index?: number): OperationSummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PortTypeInfo.AsObject;
  static toObject(includeInstance: boolean, msg: PortTypeInfo): PortTypeInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PortTypeInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PortTypeInfo;
  static deserializeBinaryFromReader(message: PortTypeInfo, reader: jspb.BinaryReader): PortTypeInfo;
}

export namespace PortTypeInfo {
  export type AsObject = {
    name: string,
    operationsList: Array<OperationSummary.AsObject>,
  }
}

export class PortTypesResult extends jspb.Message {
  clearPortTypesList(): void;
  getPortTypesList(): Array<PortTypeInfo>;
  setPortTypesList(value: Array<PortTypeInfo>): void;
  addPortTypes(value?: PortTypeInfo, index?: number): PortTypeInfo;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PortTypesResult.AsObject;
  static toObject(includeInstance: boolean, msg: PortTypesResult): PortTypesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PortTypesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PortTypesResult;
  static deserializeBinaryFromReader(message: PortTypesResult, reader: jspb.BinaryReader): PortTypesResult;
}

export namespace PortTypesResult {
  export type AsObject = {
    portTypesList: Array<PortTypeInfo.AsObject>,
    error: string,
  }
}

export class GetOperationInput extends jspb.Message {
  getWsdl(): string;
  setWsdl(value: string): void;

  getOperationName(): string;
  setOperationName(value: string): void;

  getPortTypeName(): string;
  setPortTypeName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetOperationInput.AsObject;
  static toObject(includeInstance: boolean, msg: GetOperationInput): GetOperationInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetOperationInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetOperationInput;
  static deserializeBinaryFromReader(message: GetOperationInput, reader: jspb.BinaryReader): GetOperationInput;
}

export namespace GetOperationInput {
  export type AsObject = {
    wsdl: string,
    operationName: string,
    portTypeName: string,
  }
}

export class OperationDetail extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  getName(): string;
  setName(value: string): void;

  getPortTypeName(): string;
  setPortTypeName(value: string): void;

  getInputMessage(): string;
  setInputMessage(value: string): void;

  getOutputMessage(): string;
  setOutputMessage(value: string): void;

  clearFaultMessagesList(): void;
  getFaultMessagesList(): Array<string>;
  setFaultMessagesList(value: Array<string>): void;
  addFaultMessages(value: string, index?: number): string;

  getSoapAction(): string;
  setSoapAction(value: string): void;

  getStyle(): string;
  setStyle(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OperationDetail.AsObject;
  static toObject(includeInstance: boolean, msg: OperationDetail): OperationDetail.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OperationDetail, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OperationDetail;
  static deserializeBinaryFromReader(message: OperationDetail, reader: jspb.BinaryReader): OperationDetail;
}

export namespace OperationDetail {
  export type AsObject = {
    found: boolean,
    name: string,
    portTypeName: string,
    inputMessage: string,
    outputMessage: string,
    faultMessagesList: Array<string>,
    soapAction: string,
    style: string,
    error: string,
  }
}

export class OperationInventoryItem extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getPortTypeName(): string;
  setPortTypeName(value: string): void;

  getInputMessage(): string;
  setInputMessage(value: string): void;

  getOutputMessage(): string;
  setOutputMessage(value: string): void;

  getHasFaults(): boolean;
  setHasFaults(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OperationInventoryItem.AsObject;
  static toObject(includeInstance: boolean, msg: OperationInventoryItem): OperationInventoryItem.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OperationInventoryItem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OperationInventoryItem;
  static deserializeBinaryFromReader(message: OperationInventoryItem, reader: jspb.BinaryReader): OperationInventoryItem;
}

export namespace OperationInventoryItem {
  export type AsObject = {
    name: string,
    portTypeName: string,
    inputMessage: string,
    outputMessage: string,
    hasFaults: boolean,
  }
}

export class OperationsResult extends jspb.Message {
  clearOperationsList(): void;
  getOperationsList(): Array<OperationInventoryItem>;
  setOperationsList(value: Array<OperationInventoryItem>): void;
  addOperations(value?: OperationInventoryItem, index?: number): OperationInventoryItem;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OperationsResult.AsObject;
  static toObject(includeInstance: boolean, msg: OperationsResult): OperationsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OperationsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OperationsResult;
  static deserializeBinaryFromReader(message: OperationsResult, reader: jspb.BinaryReader): OperationsResult;
}

export namespace OperationsResult {
  export type AsObject = {
    operationsList: Array<OperationInventoryItem.AsObject>,
    error: string,
  }
}

export class MessagePart extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getElement(): string;
  setElement(value: string): void;

  getType(): string;
  setType(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessagePart.AsObject;
  static toObject(includeInstance: boolean, msg: MessagePart): MessagePart.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessagePart, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessagePart;
  static deserializeBinaryFromReader(message: MessagePart, reader: jspb.BinaryReader): MessagePart;
}

export namespace MessagePart {
  export type AsObject = {
    name: string,
    element: string,
    type: string,
  }
}

export class MessageInfo extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  clearPartsList(): void;
  getPartsList(): Array<MessagePart>;
  setPartsList(value: Array<MessagePart>): void;
  addParts(value?: MessagePart, index?: number): MessagePart;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageInfo.AsObject;
  static toObject(includeInstance: boolean, msg: MessageInfo): MessageInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageInfo;
  static deserializeBinaryFromReader(message: MessageInfo, reader: jspb.BinaryReader): MessageInfo;
}

export namespace MessageInfo {
  export type AsObject = {
    name: string,
    partsList: Array<MessagePart.AsObject>,
  }
}

export class MessagesResult extends jspb.Message {
  clearMessagesList(): void;
  getMessagesList(): Array<MessageInfo>;
  setMessagesList(value: Array<MessageInfo>): void;
  addMessages(value?: MessageInfo, index?: number): MessageInfo;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessagesResult.AsObject;
  static toObject(includeInstance: boolean, msg: MessagesResult): MessagesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessagesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessagesResult;
  static deserializeBinaryFromReader(message: MessagesResult, reader: jspb.BinaryReader): MessagesResult;
}

export namespace MessagesResult {
  export type AsObject = {
    messagesList: Array<MessageInfo.AsObject>,
    error: string,
  }
}

export class BindingOperation extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getSoapAction(): string;
  setSoapAction(value: string): void;

  getStyle(): string;
  setStyle(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BindingOperation.AsObject;
  static toObject(includeInstance: boolean, msg: BindingOperation): BindingOperation.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BindingOperation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BindingOperation;
  static deserializeBinaryFromReader(message: BindingOperation, reader: jspb.BinaryReader): BindingOperation;
}

export namespace BindingOperation {
  export type AsObject = {
    name: string,
    soapAction: string,
    style: string,
  }
}

export class BindingInfo extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getType(): string;
  setType(value: string): void;

  getTransport(): string;
  setTransport(value: string): void;

  getStyle(): string;
  setStyle(value: string): void;

  getSoapVersion(): string;
  setSoapVersion(value: string): void;

  clearOperationsList(): void;
  getOperationsList(): Array<BindingOperation>;
  setOperationsList(value: Array<BindingOperation>): void;
  addOperations(value?: BindingOperation, index?: number): BindingOperation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BindingInfo.AsObject;
  static toObject(includeInstance: boolean, msg: BindingInfo): BindingInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BindingInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BindingInfo;
  static deserializeBinaryFromReader(message: BindingInfo, reader: jspb.BinaryReader): BindingInfo;
}

export namespace BindingInfo {
  export type AsObject = {
    name: string,
    type: string,
    transport: string,
    style: string,
    soapVersion: string,
    operationsList: Array<BindingOperation.AsObject>,
  }
}

export class BindingsResult extends jspb.Message {
  clearBindingsList(): void;
  getBindingsList(): Array<BindingInfo>;
  setBindingsList(value: Array<BindingInfo>): void;
  addBindings(value?: BindingInfo, index?: number): BindingInfo;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BindingsResult.AsObject;
  static toObject(includeInstance: boolean, msg: BindingsResult): BindingsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BindingsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BindingsResult;
  static deserializeBinaryFromReader(message: BindingsResult, reader: jspb.BinaryReader): BindingsResult;
}

export namespace BindingsResult {
  export type AsObject = {
    bindingsList: Array<BindingInfo.AsObject>,
    error: string,
  }
}

export class XsdField extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getType(): string;
  setType(value: string): void;

  getMinOccurs(): string;
  setMinOccurs(value: string): void;

  getMaxOccurs(): string;
  setMaxOccurs(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): XsdField.AsObject;
  static toObject(includeInstance: boolean, msg: XsdField): XsdField.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: XsdField, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): XsdField;
  static deserializeBinaryFromReader(message: XsdField, reader: jspb.BinaryReader): XsdField;
}

export namespace XsdField {
  export type AsObject = {
    name: string,
    type: string,
    minOccurs: string,
    maxOccurs: string,
  }
}

export class XsdComplexType extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  clearFieldsList(): void;
  getFieldsList(): Array<XsdField>;
  setFieldsList(value: Array<XsdField>): void;
  addFields(value?: XsdField, index?: number): XsdField;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): XsdComplexType.AsObject;
  static toObject(includeInstance: boolean, msg: XsdComplexType): XsdComplexType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: XsdComplexType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): XsdComplexType;
  static deserializeBinaryFromReader(message: XsdComplexType, reader: jspb.BinaryReader): XsdComplexType;
}

export namespace XsdComplexType {
  export type AsObject = {
    name: string,
    fieldsList: Array<XsdField.AsObject>,
  }
}

export class XsdElement extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getType(): string;
  setType(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): XsdElement.AsObject;
  static toObject(includeInstance: boolean, msg: XsdElement): XsdElement.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: XsdElement, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): XsdElement;
  static deserializeBinaryFromReader(message: XsdElement, reader: jspb.BinaryReader): XsdElement;
}

export namespace XsdElement {
  export type AsObject = {
    name: string,
    type: string,
  }
}

export class TypesResult extends jspb.Message {
  getTargetNamespace(): string;
  setTargetNamespace(value: string): void;

  clearElementsList(): void;
  getElementsList(): Array<XsdElement>;
  setElementsList(value: Array<XsdElement>): void;
  addElements(value?: XsdElement, index?: number): XsdElement;

  clearComplexTypesList(): void;
  getComplexTypesList(): Array<XsdComplexType>;
  setComplexTypesList(value: Array<XsdComplexType>): void;
  addComplexTypes(value?: XsdComplexType, index?: number): XsdComplexType;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TypesResult.AsObject;
  static toObject(includeInstance: boolean, msg: TypesResult): TypesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TypesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TypesResult;
  static deserializeBinaryFromReader(message: TypesResult, reader: jspb.BinaryReader): TypesResult;
}

export namespace TypesResult {
  export type AsObject = {
    targetNamespace: string,
    elementsList: Array<XsdElement.AsObject>,
    complexTypesList: Array<XsdComplexType.AsObject>,
    error: string,
  }
}

export class NamespaceDecl extends jspb.Message {
  getPrefix(): string;
  setPrefix(value: string): void;

  getUri(): string;
  setUri(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NamespaceDecl.AsObject;
  static toObject(includeInstance: boolean, msg: NamespaceDecl): NamespaceDecl.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NamespaceDecl, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NamespaceDecl;
  static deserializeBinaryFromReader(message: NamespaceDecl, reader: jspb.BinaryReader): NamespaceDecl;
}

export namespace NamespaceDecl {
  export type AsObject = {
    prefix: string,
    uri: string,
  }
}

export class NamespacesResult extends jspb.Message {
  clearNamespacesList(): void;
  getNamespacesList(): Array<NamespaceDecl>;
  setNamespacesList(value: Array<NamespaceDecl>): void;
  addNamespaces(value?: NamespaceDecl, index?: number): NamespaceDecl;

  getTargetNamespace(): string;
  setTargetNamespace(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NamespacesResult.AsObject;
  static toObject(includeInstance: boolean, msg: NamespacesResult): NamespacesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NamespacesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NamespacesResult;
  static deserializeBinaryFromReader(message: NamespacesResult, reader: jspb.BinaryReader): NamespacesResult;
}

export namespace NamespacesResult {
  export type AsObject = {
    namespacesList: Array<NamespaceDecl.AsObject>,
    targetNamespace: string,
    error: string,
  }
}

export class ImportDecl extends jspb.Message {
  getNamespace(): string;
  setNamespace(value: string): void;

  getLocation(): string;
  setLocation(value: string): void;

  getKind(): string;
  setKind(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ImportDecl.AsObject;
  static toObject(includeInstance: boolean, msg: ImportDecl): ImportDecl.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ImportDecl, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ImportDecl;
  static deserializeBinaryFromReader(message: ImportDecl, reader: jspb.BinaryReader): ImportDecl;
}

export namespace ImportDecl {
  export type AsObject = {
    namespace: string,
    location: string,
    kind: string,
  }
}

export class ImportsResult extends jspb.Message {
  clearImportsList(): void;
  getImportsList(): Array<ImportDecl>;
  setImportsList(value: Array<ImportDecl>): void;
  addImports(value?: ImportDecl, index?: number): ImportDecl;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ImportsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ImportsResult): ImportsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ImportsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ImportsResult;
  static deserializeBinaryFromReader(message: ImportsResult, reader: jspb.BinaryReader): ImportsResult;
}

export namespace ImportsResult {
  export type AsObject = {
    importsList: Array<ImportDecl.AsObject>,
    error: string,
  }
}

export class ResolveOperationEndpointInput extends jspb.Message {
  getWsdl(): string;
  setWsdl(value: string): void;

  getOperationName(): string;
  setOperationName(value: string): void;

  getServiceName(): string;
  setServiceName(value: string): void;

  getPortName(): string;
  setPortName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResolveOperationEndpointInput.AsObject;
  static toObject(includeInstance: boolean, msg: ResolveOperationEndpointInput): ResolveOperationEndpointInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResolveOperationEndpointInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResolveOperationEndpointInput;
  static deserializeBinaryFromReader(message: ResolveOperationEndpointInput, reader: jspb.BinaryReader): ResolveOperationEndpointInput;
}

export namespace ResolveOperationEndpointInput {
  export type AsObject = {
    wsdl: string,
    operationName: string,
    serviceName: string,
    portName: string,
  }
}

export class ResolvedEndpoint extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  getOperationName(): string;
  setOperationName(value: string): void;

  getPortTypeName(): string;
  setPortTypeName(value: string): void;

  getBindingName(): string;
  setBindingName(value: string): void;

  getServiceName(): string;
  setServiceName(value: string): void;

  getPortName(): string;
  setPortName(value: string): void;

  getAddressLocation(): string;
  setAddressLocation(value: string): void;

  getTransport(): string;
  setTransport(value: string): void;

  getSoapAction(): string;
  setSoapAction(value: string): void;

  getStyle(): string;
  setStyle(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResolvedEndpoint.AsObject;
  static toObject(includeInstance: boolean, msg: ResolvedEndpoint): ResolvedEndpoint.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResolvedEndpoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResolvedEndpoint;
  static deserializeBinaryFromReader(message: ResolvedEndpoint, reader: jspb.BinaryReader): ResolvedEndpoint;
}

export namespace ResolvedEndpoint {
  export type AsObject = {
    found: boolean,
    operationName: string,
    portTypeName: string,
    bindingName: string,
    serviceName: string,
    portName: string,
    addressLocation: string,
    transport: string,
    soapAction: string,
    style: string,
    error: string,
  }
}

export class WsdlSummary extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  getTargetNamespace(): string;
  setTargetNamespace(value: string): void;

  getServiceCount(): number;
  setServiceCount(value: number): void;

  getPortCount(): number;
  setPortCount(value: number): void;

  getBindingCount(): number;
  setBindingCount(value: number): void;

  getPortTypeCount(): number;
  setPortTypeCount(value: number): void;

  getOperationCount(): number;
  setOperationCount(value: number): void;

  getMessageCount(): number;
  setMessageCount(value: number): void;

  getComplexTypeCount(): number;
  setComplexTypeCount(value: number): void;

  getElementCount(): number;
  setElementCount(value: number): void;

  getImportCount(): number;
  setImportCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WsdlSummary.AsObject;
  static toObject(includeInstance: boolean, msg: WsdlSummary): WsdlSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WsdlSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WsdlSummary;
  static deserializeBinaryFromReader(message: WsdlSummary, reader: jspb.BinaryReader): WsdlSummary;
}

export namespace WsdlSummary {
  export type AsObject = {
    version: string,
    targetNamespace: string,
    serviceCount: number,
    portCount: number,
    bindingCount: number,
    portTypeCount: number,
    operationCount: number,
    messageCount: number,
    complexTypeCount: number,
    elementCount: number,
    importCount: number,
    error: string,
  }
}

export class ValidationIssue extends jspb.Message {
  getSeverity(): string;
  setSeverity(value: string): void;

  getCode(): string;
  setCode(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidationIssue.AsObject;
  static toObject(includeInstance: boolean, msg: ValidationIssue): ValidationIssue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidationIssue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidationIssue;
  static deserializeBinaryFromReader(message: ValidationIssue, reader: jspb.BinaryReader): ValidationIssue;
}

export namespace ValidationIssue {
  export type AsObject = {
    severity: string,
    code: string,
    message: string,
  }
}

export class ValidationResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  getVersion(): string;
  setVersion(value: string): void;

  clearIssuesList(): void;
  getIssuesList(): Array<ValidationIssue>;
  setIssuesList(value: Array<ValidationIssue>): void;
  addIssues(value?: ValidationIssue, index?: number): ValidationIssue;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidationResult.AsObject;
  static toObject(includeInstance: boolean, msg: ValidationResult): ValidationResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidationResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidationResult;
  static deserializeBinaryFromReader(message: ValidationResult, reader: jspb.BinaryReader): ValidationResult;
}

export namespace ValidationResult {
  export type AsObject = {
    valid: boolean,
    version: string,
    issuesList: Array<ValidationIssue.AsObject>,
    error: string,
  }
}

export class WsdlVersionResult extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  getRootElement(): string;
  setRootElement(value: string): void;

  getNamespaceUri(): string;
  setNamespaceUri(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WsdlVersionResult.AsObject;
  static toObject(includeInstance: boolean, msg: WsdlVersionResult): WsdlVersionResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WsdlVersionResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WsdlVersionResult;
  static deserializeBinaryFromReader(message: WsdlVersionResult, reader: jspb.BinaryReader): WsdlVersionResult;
}

export namespace WsdlVersionResult {
  export type AsObject = {
    version: string,
    rootElement: string,
    namespaceUri: string,
    error: string,
  }
}

export class WsdlDocument extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  getTargetNamespace(): string;
  setTargetNamespace(value: string): void;

  clearNamespacesList(): void;
  getNamespacesList(): Array<NamespaceDecl>;
  setNamespacesList(value: Array<NamespaceDecl>): void;
  addNamespaces(value?: NamespaceDecl, index?: number): NamespaceDecl;

  clearServicesList(): void;
  getServicesList(): Array<ServiceInfo>;
  setServicesList(value: Array<ServiceInfo>): void;
  addServices(value?: ServiceInfo, index?: number): ServiceInfo;

  clearBindingsList(): void;
  getBindingsList(): Array<BindingInfo>;
  setBindingsList(value: Array<BindingInfo>): void;
  addBindings(value?: BindingInfo, index?: number): BindingInfo;

  clearPortTypesList(): void;
  getPortTypesList(): Array<PortTypeInfo>;
  setPortTypesList(value: Array<PortTypeInfo>): void;
  addPortTypes(value?: PortTypeInfo, index?: number): PortTypeInfo;

  clearMessagesList(): void;
  getMessagesList(): Array<MessageInfo>;
  setMessagesList(value: Array<MessageInfo>): void;
  addMessages(value?: MessageInfo, index?: number): MessageInfo;

  clearTypesElementsList(): void;
  getTypesElementsList(): Array<XsdElement>;
  setTypesElementsList(value: Array<XsdElement>): void;
  addTypesElements(value?: XsdElement, index?: number): XsdElement;

  clearTypesComplexTypesList(): void;
  getTypesComplexTypesList(): Array<XsdComplexType>;
  setTypesComplexTypesList(value: Array<XsdComplexType>): void;
  addTypesComplexTypes(value?: XsdComplexType, index?: number): XsdComplexType;

  clearImportsList(): void;
  getImportsList(): Array<ImportDecl>;
  setImportsList(value: Array<ImportDecl>): void;
  addImports(value?: ImportDecl, index?: number): ImportDecl;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WsdlDocument.AsObject;
  static toObject(includeInstance: boolean, msg: WsdlDocument): WsdlDocument.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WsdlDocument, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WsdlDocument;
  static deserializeBinaryFromReader(message: WsdlDocument, reader: jspb.BinaryReader): WsdlDocument;
}

export namespace WsdlDocument {
  export type AsObject = {
    version: string,
    targetNamespace: string,
    namespacesList: Array<NamespaceDecl.AsObject>,
    servicesList: Array<ServiceInfo.AsObject>,
    bindingsList: Array<BindingInfo.AsObject>,
    portTypesList: Array<PortTypeInfo.AsObject>,
    messagesList: Array<MessageInfo.AsObject>,
    typesElementsList: Array<XsdElement.AsObject>,
    typesComplexTypesList: Array<XsdComplexType.AsObject>,
    importsList: Array<ImportDecl.AsObject>,
    error: string,
  }
}

