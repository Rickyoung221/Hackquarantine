library(readr)
confirmed <- read_csv("Desktop/Hackquarantine-Perry/server/confirmed.csv")
death <- read_csv("Desktop/Hackquarantine-Perry/server/death.csv")
# concise view of total confirmed for each county 
name <- confirmed$`County Name`
fips <- confirmed$countyFIPS
confirmed_aug <- numeric(0)
for (i in 1:(nrow(confirmed))) {
  for (j in 5:ncol(confirmed)) {
    confirmed_aug[i] <- sum(confirmed[[j]][i])
  }
}
tot_confirmed <- data.frame(name, fips, confirmed_aug)
names(tot_confirmed) <- c("county name", "fips", "total cases")
tot_confirmed <- tot_confirmed[-which(tot_confirmed[, 1] == "Statewide Unallocated")]
name_d <- death$`County Name`
fips_d <- death$countyFIPS
confirmed_aug_d <- numeric(0)
for (i in 1:(nrow(death))) {
  for (j in 5:ncol(death)) {
    confirmed_aug_d[i] <- sum(death[[j]][i])
  }
}
tot_confirmed_d <- data.frame(name_d, fips_d, confirmed_aug_d)
names(tot_confirmed_d) <- c("county name", "fips", "total death")
tot_confirmed_d <- tot_confirmed_d[-which(tot_confirmed_d[, 1] == "Statewide Unallocated")]

#to find the confirmed, used tot_confirmed[i, 3], where i is the row number of desired county
#to find the deaths, used tot_confirmed_d[i, 3], where i is the row number of desired county