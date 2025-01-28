namespace Utilities{
    public class CsvExporter
    {
        public string ExportToCsv(List<Customer> customers)
        {
            var csvBuilder = new StringBuilder();

            foreach (var customer in customers)
            {
                csvBuilder.AppendLine($"{customer.CustomerID},{customer.CompanyName},{customer.ContactName},{customer.Country}");
            }

            return csvBuilder.ToString();
        }
    }
}
