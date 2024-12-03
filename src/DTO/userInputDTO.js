import User from "../models/userModel.js"

class UserInputDTO {
  constructor(data) {
    const { username, password, idCard, name, role } = data

    if (!username || !name || !password || !idCard || !role ) {
      throw new Error("MissingRequiredFields")
    }
    this.username = username
    this.name = name
    this.password = password
    this.idCard = idCard
    this.role = role
    this.status = "active"
  }

  async toUser() {
    return new User({
      username: this.username,
      name: this.name,
      idCard: this.idCard,
      password: this.password,
      role: this.role,
      status: "active"
    })
  }
  
}

export default UserInputDTO