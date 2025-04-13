// src/common/pipes/validation.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToClass(metatype, value);
        const errors = await validate(object, {
            whitelist: true,
            forbidNonWhitelisted: true,
            validationError: { target: false }
        });

        if (errors.length > 0) {
            const errorMessages = errors.flatMap(error =>
                Object.values(error.constraints || {})
            );

            throw new BadRequestException({
                message: errorMessages,
                error: 'Bad Request',
                statusCode: 400
            });
        }

        return object; // Return the transformed object
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
// import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
// import { validate } from 'class-validator';
// import { plainToClass } from 'class-transformer';

// @Injectable()
// export class ValidationPipe implements PipeTransform<any> {
//     async transform(value: any, { metatype }: ArgumentMetadata) {
//         if (!metatype || !this.toValidate(metatype)) {
//             return value;
//         }
//         const object = plainToClass(metatype, value);
//         const errors = await validate(object);
//         if (errors.length > 0) {
//             const errorMessages = errors.map(error => {
//                 return {
//                     property: error.property,
//                     constraints: error.constraints,
//                 };
//             });
//             throw new BadRequestException({
//                 message: 'Validation failed',
//                 errors: errorMessages,
//             });
//         }
//         return value;
//     }

//     private toValidate(metatype: Function): boolean {
//         const types: Function[] = [String, Boolean, Number, Array, Object];
//         return !types.includes(metatype);
//     }
// }