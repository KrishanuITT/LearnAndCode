using Utilities;
public class CustomerSearcher
{

    private readonly CsvExporter _csvExporter;

    public CustomerSearcher(CsvExporter csvExporter)
    {
        _csvExporter = csvExporter;
    }

    public List<Customer> SearchByCountry(string countryName)
    {
        return SearchCustomers(c => c.Country.Contains(countryName));
    }

    public List<Customer> SearchByCompanyName(string companyName)
    {
        return SearchCustomers(c => c.CompanyName.Contains(companyName));
    }

    public List<Customer> SearchByContact(string contactName)
    {
        return SearchCustomers(c => c.ContactName.Contains(contactName));
    }

    private List<Customer> SearchCustomers(Func<Customer, bool> predicate)
    {
        var query = from c in db.Customers
                    where predicate(c)
                    orderby c.CustomerID ascending
                    select c;

        return query.ToList();
    }
}
