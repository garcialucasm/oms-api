import Outbreak from "../models/outbreakModel.js"
import Virus from "../models/virusModel.js"
import Zone from "../models/zoneModel.js"
import OutbreakInputDTO from "../DTO/outbreakInputDTO.js"

class OutbreakService {
  async create(data) {
    const { co, cv, cz, startDate, endDate } = data

    if (!co || !cv || !cz || !startDate) {
      throw new Error("MissingRequiredFields")
    }

    const outbreakVirus = await Virus.findOne({ cv: cv })
    if (!outbreakVirus) {
      throw new Error("VirusNotFound")
    }

    const outbreakZone = await Zone.findOne({ cz: cz })
    if (!outbreakZone) {
      throw new Error("ZoneNotFound")
    }

    const outbreakExists = await Outbreak.findOne({
      cv: outbreakVirus._id,
      cz: outbreakZone._id,
      condition: "active",
    })
    if (outbreakExists) {
      throw new Error("OutbreakAlreadyExists")
    }

    //Passar a condition a "occurred" caso o documento a editar já tenha endDate e caso se escreva uma endDate
    let condition
    if (endDate !== null) {
      condition = "occurred"
    } else {
      condition = "active"
    }

    const parsedStartDate = new Date(startDate)
    const parsedEndDate = endDate ? new Date(endDate) : null

    const outbreakInputDTO = new OutbreakInputDTO(
      co,
      cv,
      cz,
      parsedStartDate,
      parsedEndDate,
      condition
    )

    const outbreak = await outbreakInputDTO.toOutbreak()

    await outbreak.save()
    return outbreak
  }

  async getAll() {
    return await Outbreak.find().populate("cv").populate("cz").exec()
  }

  async list(data) {
    return await Outbreak.find(data).populate("cv").populate("cz").exec()
  }

  async update(code, data) {
    const { co, cv, cz, startDate, endDate } = data

    const outbreak = await Outbreak.findOne({ co: code })
    if (!outbreak) {
      throw new Error("OutbreakNotFound")
    }

    const virus = await Virus.findOne({ cv: cv })
    if (!virus && cv !== undefined) {
      throw new Error("VirusNotFound")
    }

    const zone = await Zone.findOne({ cz: cz })
    if (!zone && cz !== undefined) {
      throw new Error("ZoneNotFound")
    }

    //Validação para não deixar um outbreak ser alterado para um cz e cv de um outbreak ativo que exista
    if (
      (cv !== undefined && virus?._id?.toString() !== outbreak.cv.toString()) ||
      (cz !== undefined && zone?._id?.toString() !== outbreak.cz.toString())
    ) {
      const outbreakExists = await Outbreak.findOne({
        cv: cv !== undefined ? virus?._id : outbreak.cv,
        cz: cz !== undefined ? zone?._id : outbreak.cz,
        condition: "active",
      })
      if (outbreakExists) {
        throw new Error("OutbreakAlreadyExists")
      }
    }

    //Passar a condition a "occurred" caso o documento a editar já tenha endDate e caso se escreva uma endDate
    let updatedCondition
    if (outbreak.endDate !== null) {
      updatedCondition = "occurred"
    } else if (endDate !== null) {
      updatedCondition = "occurred"
    } else {
      updatedCondition = "active"
    }

    outbreak.co = co || outbreak.co
    outbreak.cv = virus?._id || outbreak.cv
    outbreak.cz = zone?._id || outbreak.cz
    outbreak.startDate = startDate || outbreak.startDate
    outbreak.endDate = endDate || outbreak.endDate
    outbreak.condition = updatedCondition || outbreak.condition

    await outbreak.save()
    const populatedOutbreak = Outbreak.findOne({ co: outbreak.co })
      .populate("cv")
      .populate("cz")
    return populatedOutbreak
  }

  async updateByCodes(codeZ, codeV, data) {
    const { co, cv, cz, startDate, endDate } = data

    //Validar dados da procura
    const ZoneRoute = await Zone.findOne({ cz: codeZ })
    if (!ZoneRoute) {
      throw new Error("ZoneNotFound")
    }

    const VirusRoute = await Virus.findOne({ cv: codeV })
    if (!VirusRoute) {
      throw new Error("VirusNotFound")
    }

    const outbreak = await Outbreak.findOne({
      cz: ZoneRoute._id,
      cv: VirusRoute._id,
    })
    if (!outbreak) {
      throw new Error("OutbreakNotFound")
    }

    //Validar dados do update
    const virus = await Virus.findOne({ cv: cv })
    if (!virus && cv !== undefined) {
      throw new Error("VirusNotFound")
    }

    const zone = await Zone.findOne({ cz: cz })
    if (!zone && cz !== undefined) {
      throw new Error("ZoneNotFound")
    }

    //Validação para não deixar um outbreak ser alterado para um cz e cv de um outbreak ativo que exista
    if (
      (cv !== undefined && virus?._id?.toString() !== outbreak.cv.toString()) ||
      (cz !== undefined && zone?._id?.toString() !== outbreak.cz.toString())
    ) {
      const outbreakExists = await Outbreak.findOne({
        cv: cv !== undefined ? virus?._id : outbreak.cv,
        cz: cz !== undefined ? zone?._id : outbreak.cz,
        condition: "active",
      })
      if (outbreakExists) {
        throw new Error("OutbreakAlreadyExists")
      }
    }

    //Passar a condition a "occurred" caso o documento a editar já tenha endDate e caso se escreva uma endDate
    let updatedCondition
    if (outbreak.endDate !== null) {
      updatedCondition = "occurred"
    } else if (endDate !== null) {
      updatedCondition = "occurred"
    } else {
      updatedCondition = "active"
    }

    outbreak.co = co || outbreak.co
    outbreak.cv = virus?._id || outbreak.cv
    outbreak.cz = zone?._id || outbreak.cz
    outbreak.startDate = startDate || outbreak.startDate
    outbreak.endDate = endDate || outbreak.endDate
    outbreak.condition = updatedCondition || outbreak.condition

    await outbreak.save()
    const populatedOutbreak = Outbreak.findOne({ co: outbreak.co })
      .populate("cv")
      .populate("cz")
    return populatedOutbreak
  }

  async delete(co) {
    const outbreak = await Outbreak.findOne({ co: co }).exec()
    if (!outbreak) {
      const error = new Error()
      error.name = "OutbreakNotFound"
      throw error
    }
    await outbreak.deleteOne()
  }
}

export default new OutbreakService()
