import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/api-response.dto';

type ApiSuccessResponseOptions = {
  status?: 200 | 201;
  description: string;
  dataType?: Type<unknown>;
  isArray?: boolean;
};

export function ApiSuccessResponse(options: ApiSuccessResponseOptions) {
  const { status = 200, description, dataType, isArray = false } = options;

  const responseDecorator = status === 201 ? ApiCreatedResponse : ApiOkResponse;

  const dataSchema = dataType
    ? isArray
      ? {
          type: 'array',
          items: { $ref: getSchemaPath(dataType) },
        }
      : { $ref: getSchemaPath(dataType) }
    : undefined;

  return applyDecorators(
    ApiExtraModels(ApiResponseDto, ...(dataType ? [dataType] : [])),
    responseDecorator({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              success: {
                type: 'boolean',
                example: true,
              },
              message: {
                type: 'string',
                example: description,
              },
              ...(dataSchema
                ? {
                    data: dataSchema,
                  }
                : {}),
            },
          },
        ],
      },
    }),
  );
}
