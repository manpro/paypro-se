# PayPro.se Data Källor Översikt

**Uppdaterad: 2025-06-10**

## 🟢 LIVE DATA via API (Uppdateras automatiskt)

### Riksbank API
- ✅ **Reporänta** - Hämtas från `SECBREPOEFF` 
- ✅ **SEK/EUR** - Hämtas från `SEKEURPMI`
- ✅ **USD/SEK** - Hämtas från `SEKUSDPMI`  
- ✅ **USD/EUR** - Hämtas från `EURUSDPMI`

### SCB API
- ✅ **BNP Tillväxt** - Hämtas från `NA0103` (kvartalsvis, säsongrensad)
- ✅ **Inflation (KPI)** - Hämtas från `PR0101` (månadsvis, årlig förändring)
- ✅ **Arbetslöshet** - Hämtas från `AM0401` (kvartalsvis AKU, säsongrensad)

### ECB Data Portal API (Nytt!)
- ✅ **ECB Deposit Facility Rate** - Hämtas från `FM/B.U2.EUR.4F.KR.DFR.LEV`

**Uppdateringsfrekvens:** Varje gång "Uppdatera"-knappen trycks eller sidan laddas

## ✅ RESULTAT: 100% LIVE DATA

**Alla 8 datapunkter kommer nu från officiella API:er:**

1. **BNP Tillväxt** - SCB API
2. **Inflation** - SCB API  
3. **Arbetslöshet** - SCB API
4. **ECB-ränta** - ECB Data Portal API
5. **Reporänta** - Riksbank API
6. **SEK/EUR** - Riksbank API
7. **USD/SEK** - Riksbank API
8. **USD/EUR** - Riksbank API

## 🔗 API Endpoints

### Live Data Endpoints:
- **PayPro API:** `/api/macro` (aggregerar all data)
- **Riksbank:** `https://api.riksbank.se/swea/v1/Observations/{seriesId}/1`
- **SCB:** `https://api.scb.se/OV0104/v1/doris/sv/ssd/START/*`
- **ECB:** `https://data-api.ecb.europa.eu/service/data/FM/*`

### Tekniska detaljer:
- **Fallback-system:** Om API:er inte fungerar används senast kända värden
- **Validering:** Alla värden valideras mot förväntade intervall
- **Timeout:** 8 sekunder per API-anrop
- **Parallell hämtning:** Alla API:er anropas samtidigt för bättre prestanda

## 🔧 Konfiguration

Alla API-anrop finns i: `lib/macroSources.ts`

**Huvudfunktion:** `getMacro()` - returnerar komplett MacroData object 