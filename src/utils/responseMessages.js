export const MESSAGES = {
  /* ------------------------ Country Success messages ------------------------ */
  COUNTRY_CREATED: "Country created successfully",
  COUNTRY_RETRIEVED_BY_CODE: "Country retrieved by code",
  COUNTRY_RETRIEVED_BY_NAME: "Country retrieved by name",
  COUNTRY_UPDATED: "Country updated successfully",
  COUNTRY_DELETED: "Country deleted successfully",
  COUNTRIES_RETRIEVED: "Countries retrieved successfully",
  /* -------------------------------------------------------------------------- */

  /* ------------------------- Country Error messages ------------------------- */
  DUPLICATE_COUNTRY:
    "Duplicate country code or country name. Please use unique values.",
  INVALID_COUNTRY_NAME:
    "Country not found with the given country name. Please enter the country name in English.",
  ZONE_NOT_FOUND_BY_CODE: "Zone not found with the given zone code.",
  COUNTRY_NOT_FOUND: "Country not found.",
  FAILED_TO_CREATE_COUNTRY: "Failed to create country",
  FAILED_TO_RETRIEVE_COUNTRIES: "Failed to retrieve countries",
  FAILED_TO_RETRIEVE_COUNTRY_BY_CODE: "Failed to retrieve country by code",
  FAILED_TO_RETRIEVE_COUNTRY_BY_NAME: "Failed to retrieve country by name",
  FAILED_TO_UPDATE_COUNTRY: "Failed to update country",
  FAILED_TO_DELETE_COUNTRY: "Failed to delete country",
  /* -------------------------------------------------------------------------- */

  /* ------------------------ Virus Success messages ------------------------ */
  VIRUS_CREATED: "Virus created successfully",
  VIRUS_RETRIEVED_BY_CODE: "Virus retrieved by code",
  VIRUS_RETRIEVED_BY_NAME: "Virus retrieved by name",
  VIRUS_UPDATED: "Virus updated successfully",
  VIRUS_DELETED: "Virus deleted successfully",
  VIRUSES_RETRIEVED: "Virues retrieved successfully",
  /* -------------------------------------------------------------------------- */

  /* ------------------------- Virus Error messages ------------------------- */
  DUPLICATE_VIRUS:
    "Duplicate virus code or name. Please use unique values for both these fields",
  VIRUS_NOT_FOUND_BY_CODE: "Virus not found with the given virus code",
  VIRUS_NOT_FOUND_BY_NAME: "Virus not found with the given virus name",
  VIRUS_SEARCHED_NOT_FOUND: "Virus not found with the searched virus code",
  VIRUS_NOT_FOUND: "Virus not found",
  NO_VIRUSES_FOUND: "No viruses found",
  FAILED_TO_CREATE_VIRUS: "Failed to create virus",
  FAILED_TO_RETRIEVE_VIRUSES: "Failed to retrieve viruses",
  FAILED_TO_RETRIEVE_VIRUS_BY_CODE: "Failed to retrieve virus by code",
  FAILED_TO_RETRIEVE_VIRUS_BY_NAME: "Failed to retrieve virus by name",
  FAILED_TO_UPDATE_VIRUS: "Failed to update virus",
  FAILED_TO_DELETE_VIRUS: "Failed to delete virus",
  CANNOT_DELETE_OUTBREAKS_ASSOCIATED:
    "Cannot delete virus because it has outbreaks associated.",
  /* -------------------------------------------------------------------------- */

  /* ------------------------ Outbreaks Success messages ------------------------ */
  OUTBREAK_CREATED: "Outbreak created successfully",
  OUTBREAK_RETRIEVED: "Outbreak retrieved successfully",
  OUTBREAK_RETRIEVED_BY_CODE: "Outbreak retrieved by code",
  OUTBREAK_UPDATED: "Outbreak updated successfully",
  OUTBREAK_DELETED: "Outbreak deleted successfully",
  OUTBREAKS_RETRIEVED: "Outbreaks retrieved successfully",
  /* -------------------------------------------------------------------------- */

  /* ------------------------- Outbreaks Error messages ------------------------- */
  OUTBREAK_ALREADY_EXISTS: "That outbreak already exists.",
  NO_OUTBREAKS_FOUND: "No outbreaks found",
  OUTBREAK_NOT_FOUND_BY_CODE:
    "Outbreak not found with the given outbreak code.",
  OUTBREAK_NOT_FOUND: "Outbreak not found.",
  FAILED_TO_CREATE_OUTBREAK: "Failed to create outbreak",
  FAILED_TO_RETRIEVE_OUTBREAKS: "Failed to retrieve outbreaks",
  FAILED_TO_RETRIEVE_OUTBREAK: "Failed to retrieve outbreak",
  FAILED_TO_RETRIEVE_OUTBREAK_BY_CODE: "Failed to retrieve outbreak by code",
  FAILED_TO_UPDATE_OUTBREAK: "Failed to update outbreak",
  FAILED_TO_DELETE_OUTBREAK: "Failed to delete outbreak",
  INVALID_STARTDATE_FORMAT: "Invalid start date format",
  INVALID_ENDDATE_FORMAT: "Invalid end date format",
  FUTURE_STARTDATE: "Start date cannot be in the future",
  FUTURE_ENDDATE: "End date cannot be in the future",
  ENDDATE_BEFORE_STARTDATE: "End date cannot be before start date",
  TRY_ACTIVE_OR_OCCURRED:
    "Failed to retrieve outbreaks. Try using either 'active' or 'occurred'",
  OUTBREAK_SEARCHED_NOT_FOUND:
    "No outbreak found with the given pair of virus and zone codes",
  CANNOT_DELETE_GUIDELINES_ASSOCIATED:
    "Cannot delete outbreak because it has guidelines associated.",
  /* -------------------------------------------------------------------------- */

  /* ------------------------- Zone Error messages ------------------------- */
  ZONE_NOT_FOUND_BY_CODE: "Zone not found with the given zone code.",
  ZONE_SEARCHED_NOT_FOUND: "Zone not found with the searched zone code",
  /* -------------------------------------------------------------------------- */

  /* ------------------------- Common Error messages ------------------------- */
  MISSING_REQUIRED_FIELDS: "Missing required fields.",
  VALIDATION_ERROR: "Validation Error",
  /* -------------------------------------------------------------------------- */
}
