import { Upload } from "@/main/models/upload.model";
import { UploadDto } from "../interfaces";
import { EntityDtoFactory } from "./entity.dto.factory";

export class UploadDtoFactory {
    static toDto(model: Upload): UploadDto {
        return {
            ...EntityDtoFactory.toDto(model),
            _type: model._type,
            ext: model.ext,
            fileName: model.fileName
        }
    }
}
