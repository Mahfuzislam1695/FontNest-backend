import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'IsValidFontArray', async: true })
@Injectable()
export class IsValidFontArray implements ValidatorConstraintInterface {
    constructor(private prisma: PrismaService) { }

    async validate(fontIds: string[], args: ValidationArguments) {
        if (!fontIds || fontIds.length < 2) return false;

        const fonts = await this.prisma.font.findMany({
            where: { id: { in: fontIds } }
        });

        return fonts.length === fontIds.length;
    }

    defaultMessage(args: ValidationArguments) {
        return 'One or more fonts do not exist in the database';
    }
}