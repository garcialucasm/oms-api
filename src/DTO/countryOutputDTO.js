class CountryOutputDTO {
  static fromCountry(countries) {
    return countries.map((country) => ({
      cc: country.cc,
      name: country.name,
      zone: country.zone,
    }))
  }
}

export default CountryOutputDTO
