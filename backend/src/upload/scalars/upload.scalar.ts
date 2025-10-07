import { GraphQLError, GraphQLScalarType } from 'graphql';
import { FileUpload } from '../upload.service';

// Export the GraphQL Upload scalar type
export const GraphQLUpload = new GraphQLScalarType({
  name: 'Upload',
  description: 'The `Upload` scalar type represents a file upload.',
  parseValue: (value: any): FileUpload => {
    if (!value || typeof value !== 'object') {
      throw new GraphQLError('Upload value must be an object');
    }
    return value as FileUpload;
  },
  serialize: () => {
    throw new GraphQLError('Upload serialization is not supported');
  },
  parseLiteral: () => {
    throw new GraphQLError('Upload literal parsing is not supported');
  },
});