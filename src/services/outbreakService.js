import Outbreak from "../models/outbreakModel.js"
import Virus from "../models/virusModel.js"
import Zone from "../models/zoneModel.js"
import Guideline from "../models/guidelineModel.js"

class OutbreakService {
  async create(outbreakModel) {
    const outbreakExists = await Outbreak.findOne({
      virus: outbreakModel.virus,
      zone: outbreakModel.zone,
      condition: "active",
    })
    if (outbreakExists) {
      if (!outbreakModel.endDate) {
        throw new Error("OutbreakAlreadyExists")
      }
    }
    return outbreakModel.save()
  }

  async getAll() {
    const outbreaks = await Outbreak.find().populate("virus").populate("zone")
    if (outbreaks.length === 0) {
      throw new Error("OutbreakNotFound")
    }
    return outbreaks
  }

  async listByOutbreak(co) {
    const outbreak = await Outbreak.findOne({ co:co })
      .populate("virus")
      .populate("zone")
    if (!outbreak) {
      throw new Error("OutbreakNotFound")
    }
    return outbreak
  }

  async listByVirus(cv) {
    const virus = await Virus.findOne({ cv: cv })
    if (!virus) {
      throw new Error("VirusNotFound")
    }

    const outbreaks = await Outbreak.find({ virus: virus._id })
      .populate("virus")
      .populate("zone")
    if (outbreaks.length === 0) {
      throw new Error("OutbreakNotFound")
    }
    return outbreaks
  }

  async listByZone(cz) {
    const zone = await Zone.findOne({ cz: cz })
    if (!zone) {
      throw new Error("ZoneNotFound")
    }

    const outbreaks = await Outbreak.find({ zone: zone._id })
      .populate("virus")
      .populate("zone")
    if (outbreaks.length === 0) {
      throw new Error("OutbreakNotFound")
    }
    return outbreaks
  }

  async listActOcc(condition) {
    if (condition !== "active" && condition !== "occurred") {
      throw new Error("InvalidParameters")
    }
    const outbreaks = await Outbreak.find({ condition })
      .populate("virus")
      .populate("zone")
    if (outbreaks.length === 0) {
      throw new Error("OutbreakNotFound")
    }
    return outbreaks
  }

  async update(co, outbreakModel) {
    const outbreak = await Outbreak.findOne({ co: co })
    if (!outbreak) {
      throw new Error("OutbreakNotFound")
    }

    //Validação para não deixar um outbreak ser alterado para um cz e cv de um outbreak ativo que exista
    const virusDB = await Virus.findOne({ _id: outbreakModel.virus })
    if (!virusDB && outbreakModel.virus !== undefined) {
      throw new Error("VirusNotFound")
    }

    const zoneDB = await Zone.findOne({ _id: outbreakModel.zone })
    if (!zoneDB && outbreakModel.zone !== undefined) {
      throw new Error("ZoneNotFound")
    }

    if (
      (outbreakModel.virus.toString() !== undefined &&
        virusDB?._id?.toString() !== outbreak.virus.toString()) ||
      (outbreakModel.zone.toString() !== undefined &&
        zoneDB?._id?.toString() !== outbreak.zone.toString())
    ) {
      const outbreakExists = await Outbreak.findOne({
        virus: outbreakModel.virus,
        zone: outbreakModel.zone,
        condition: "active",
      })
      if (outbreakExists) {
        if (!outbreakModel.endDate) {
          throw new Error("OutbreakAlreadyExists")
        }
      }
    }
    //Passar a condition a "occurred" caso o documento a editar já tenha endDate e caso se escreva uma endDate
    let updatedCondition
    if (outbreakModel.endDate !== null) {
      updatedCondition = "occurred"
    } else if (outbreak.endDate !== null) {
      updatedCondition = "occurred"
    } else {
      updatedCondition = "active"
    }

    outbreak.co = outbreakModel.co || outbreak.co
    outbreak.virus = virusDB?._id || outbreak.virus
    outbreak.zone = zoneDB?._id || outbreak.zone
    outbreak.startDate = outbreakModel.startDate || outbreak.startDate
    outbreak.endDate = outbreakModel.endDate || outbreak.endDate
    outbreak.condition = updatedCondition || outbreak.condition

    await outbreak.save()

    return await Outbreak.findOne({ co: outbreak.co })
      .populate("virus")
      .populate("zone")
  }

  async updateByZoneCodeVirusCode(cz, cv, outbreakModel) {
    console.log(cz)
    //Validação para verificar se existe algum virus com cv, zona com cz e outbreak com o par
    const virus = await Virus.findOne({ cv: cv })
    if (!virus) {
      throw new Error("VirusSearchedNotFound")
    }

    const zone = await Zone.findOne({ cz: cz })
    if (!zone) {
      throw new Error("ZoneSearchedNotFound")
    }

    const outbreak = await Outbreak.findOne({
      zone: zone._id,
      virus: virus._id,
    })
    if (!outbreak) {
      throw new Error("OutbreakSearchedNotFound")
    }

    //Validação para não deixar um outbreak ser alterado para um cz e cv de um outbreak ativo que exista
    const virusDB = await Virus.findOne({ _id: outbreakModel.virus })
    if (!virusDB && outbreakModel.virus !== undefined) {
      throw new Error("VirusNotFound")
    }

    const zoneDB = await Zone.findOne({ _id: outbreakModel.zone })
    if (!zoneDB && outbreakModel.zone !== undefined) {
      throw new Error("ZoneNotFound")
    }

    if (
      (outbreakModel.virus.toString() !== undefined &&
        virusDB?._id?.toString() !== outbreak.virus.toString()) ||
      (outbreakModel.zone.toString() !== undefined &&
        zoneDB?._id?.toString() !== outbreak.zone.toString())
    ) {
      const outbreakExists = await Outbreak.findOne({
        virus: outbreakModel.virus,
        zone: outbreakModel.zone,
        condition: "active",
      })
      if (outbreakExists) {
        if (!outbreakModel.endDate) {
          throw new Error("OutbreakAlreadyExists")
        }
      }
    }
    //Passar a condition a "occurred" caso o documento a editar já tenha endDate e caso se escreva uma endDate
    let updatedCondition
    if (outbreakModel.endDate !== null) {
      updatedCondition = "occurred"
    } else if (outbreak.endDate !== null) {
      updatedCondition = "occurred"
    } else {
      updatedCondition = "active"
    }

    outbreak.co = outbreakModel.co || outbreak.co
    outbreak.virus = virusDB?._id || outbreak.virus
    outbreak.zone = zoneDB?._id || outbreak.zone
    outbreak.startDate = outbreakModel.startDate || outbreak.startDate
    outbreak.endDate = outbreakModel.endDate || outbreak.endDate
    outbreak.condition = updatedCondition || outbreak.condition

    await outbreak.save()

    return await Outbreak.findOne({ co: outbreak.co })
      .populate("virus")
      .populate("zone")
  }

  async delete(co) {
    const outbreak = await Outbreak.findOne({ co: co })
    if (!outbreak) {
      throw new Error("OutbreakNotFound")
    }

    const guideline = await Guideline.findOne({ outbreak: outbreak._id })
    if (guideline) {
      throw new Error("GuidelineAssociated")
    }

    await outbreak.deleteOne()
  }
}

export default new OutbreakService()
