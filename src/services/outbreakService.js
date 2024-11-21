import Outbreak from "../models/outbreakModel.js"
import Virus from "../models/virusModel.js"
import Zone from "../models/zoneModel.js"
import OutbreakInputDTO from "../DTO/outbreakInputDTO.js"

class OutbreakService {
  async create(data) {
    const { co, virus, zone, startDate, endDate } = data

    if (!co || !virus || !zone || !startDate) {
      throw new Error("MissingRequiredFields")
    }

    const parsedStartDate = new Date(startDate)
    const parsedEndDate = endDate ? new Date(endDate) : null

    if (isNaN(parsedStartDate.getTime())) {
      throw new Error("InvalidStartDateFormat")
    }
    if (parsedStartDate > Date.now()) {
      throw new Error("FutureStartDate")
    }

    if (endDate && isNaN(parsedEndDate.getTime())) {
      throw new Error("InvalidEndDateFormat")
    }

    if (parsedEndDate !== null) {
      if (parsedEndDate < parsedStartDate) {
        throw new Error("EndDateBeforeStartDate")
      } else if (parsedEndDate > Date.now()) {
        throw new Error("FutureEndDate")
      }
    }

    const outbreakVirus = await Virus.findOne({ cv: virus })
    if (!outbreakVirus) {
      throw new Error("VirusNotFound")
    }

    const outbreakZone = await Zone.findOne({ cz: zone })
    if (!outbreakZone) {
      throw new Error("ZoneNotFound")
    }

    const outbreakExists = await Outbreak.findOne({
      virus: outbreakVirus._id,
      zone: outbreakZone._id,
      condition: "active",
    })
    if (outbreakExists) {
      throw new Error("OutbreakAlreadyExists")
    }

    //Passar a condition a "occurred" caso o documento tenha endDate
    let condition
    if (endDate) {
      condition = "occurred"
    } else {
      condition = "active"
    }

    const outbreakInputDTO = new OutbreakInputDTO(
      co,
      virus,
      zone,
      parsedStartDate,
      parsedEndDate,
      condition
    )

    const outbreak = await outbreakInputDTO.toOutbreak()

    await outbreak.save()
    return outbreak
  }

  async getAll() {
    return await Outbreak.find().populate("virus").populate("zone").exec()
  }

  async list(data) {
    return await Outbreak.find(data).populate("virus").populate("zone").exec()
  }

  async listActOcc(data) {
    if (data !== "active" && data !== "occurred") {
      throw new Error("InvalidParameters")
    }
    return await Outbreak.find({ condition: data })
      .populate("virus")
      .populate("zone")
      .exec()
  }

  async update(code, data) {
    const { co, virus, zone, startDate, endDate } = data

    const outbreak = await Outbreak.findOne({ co: code })
    if (!outbreak) {
      throw new Error("OutbreakNotFound")
    }

    const parsedEndDate = endDate ? new Date(endDate) : null

    let parsedStartDate = null
    if (startDate) {
      parsedStartDate = new Date(startDate)

      if (isNaN(parsedStartDate.getTime())) {
        throw new Error("InvalidStartDateFormat")
      }

      if (parsedStartDate > Date.now()) {
        throw new Error("FutureStartDate")
      }
    }

    if (endDate && isNaN(parsedEndDate.getTime())) {
      throw new Error("InvalidEndDateFormat")
    }

    if (parsedEndDate !== null) {
      if (parsedEndDate < parsedStartDate) {
        throw new Error("EndDateBeforeStartDate")
      } else if (parsedEndDate > Date.now()) {
        throw new Error("FutureEndDate")
      }
    }

    const virusDB = await Virus.findOne({ cv: virus })
    if (!virusDB && virus !== undefined) {
      throw new Error("VirusNotFound")
    }

    const zoneDB = await Zone.findOne({ cz: zone })
    if (!zoneDB && zone !== undefined) {
      throw new Error("ZoneNotFound")
    }

    //Validação para não deixar um outbreak ser alterado para um cz e cv de um outbreak ativo que exista
    if (
      (virus !== undefined && virusDB?._id?.toString() !== outbreak.virus.toString()) ||
      (zone !== undefined && zoneDB?._id?.toString() !== outbreak.zone.toString())
    ) {
      const outbreakExists = await Outbreak.findOne({
        virus: virus !== undefined ? virusDB?._id : outbreak.virus,
        zone: zone !== undefined ? zoneDB?._id : outbreak.zone,
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
    outbreak.virus = virusDB?._id || outbreak.virus
    outbreak.zone = zoneDB?._id || outbreak.zone
    outbreak.startDate = parsedStartDate || outbreak.startDate
    outbreak.endDate = parsedEndDate || outbreak.endDate
    outbreak.condition = updatedCondition || outbreak.condition

    await outbreak.save()
    const populatedOutbreak = Outbreak.findOne({ co: outbreak.co })
      .populate("virus")
      .populate("zone")
    return populatedOutbreak
  }

  async updateByCodes(codeZ, codeV, data) {
    const { co, virus, zone, startDate, endDate } = data

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
      zone: ZoneRoute._id,
      virus: VirusRoute._id,
    })
    if (!outbreak) {
      throw new Error("OutbreakNotFound")
    }

    //Validação das datas
    const parsedEndDate = endDate ? new Date(endDate) : null

    let parsedStartDate = null
    if (startDate) {
      parsedStartDate = new Date(startDate)

      if (isNaN(parsedStartDate.getTime())) {
        throw new Error("InvalidStartDateFormat")
      }

      if (parsedStartDate > Date.now()) {
        throw new Error("FutureStartDate")
      }
    }

    if (endDate && isNaN(parsedEndDate.getTime())) {
      throw new Error("InvalidEndDateFormat")
    }

    if (parsedEndDate !== null) {
      if (parsedEndDate < parsedStartDate) {
        throw new Error("EndDateBeforeStartDate")
      } else if (parsedEndDate > Date.now()) {
        throw new Error("FutureEndDate")
      }
    }

    //Validar dados do update
    const virusDB = await Virus.findOne({ cv: virus })
    if (!virusDB && virus !== undefined) {
      throw new Error("VirusNotFound")
    }

    const zoneDB = await Zone.findOne({ cz: zone })
    if (!zoneDB && zone !== undefined) {
      throw new Error("ZoneNotFound")
    }

    //Validação para não deixar um outbreak ser alterado para um cz e cv de um outbreak ativo que exista
    if (
      (virus !== undefined && virusDB?._id?.toString() !== outbreak.virus.toString()) ||
      (zone !== undefined && zoneDB?._id?.toString() !== outbreak.zone.toString())
    ) {
      const outbreakExists = await Outbreak.findOne({
        virus: virus !== undefined ? virusDB?._id : outbreak.virus,
        zone: zone !== undefined ? zoneDB?._id : outbreak.zone,
        condition: "active",
      })
      if (outbreakExists) {
        throw new Error("OutbreakAlreadyExists")
      }
    }

    //Passar a condition a "occurred" caso o documento a editar já tenha endDate e caso se escreva uma endDate
    let updatedCondition
    if (outbreak.endDate) {
      updatedCondition = "occurred"
    } else if (endDate) {
      updatedCondition = "occurred"
    } else {
      updatedCondition = "active"
    }

    outbreak.co = co || outbreak.co
    outbreak.virus = virusDB?._id || outbreak.virus
    outbreak.zone = zoneDB?._id || outbreak.zone
    outbreak.startDate = parsedStartDate || outbreak.startDate
    outbreak.endDate = parsedEndDate || outbreak.endDate
    outbreak.condition = updatedCondition || outbreak.condition

    await outbreak.save()
    const populatedOutbreak = Outbreak.findOne({ co: outbreak.co })
      .populate("virus")
      .populate("zone")
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
