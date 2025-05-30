using Project_2.Models;
using Project_2.Models.DTOs;

namespace Project_2.Data;

public interface IPropertyRepository : IBaseRepository<Property>
{
    public Task<IEnumerable<Property>> GetAllWithFilters(
        string country,
        string state,
        string city,
        string zip,
        string address,
        decimal priceMax,
        decimal priceMin,
        int numBedroom,
        decimal numBathroom,
        int numGarages,
        int numPools,
        bool forSale,
        bool hasBasement,
        Guid? OwnerId);

    public Task<IEnumerable<PropertyResponseDTO>> GetAllWithinDistOf(Guid propertyId, int meters);
    public Task<IEnumerable<PropertySearchResponseDTO>> GetAllLikeAddress(string address);
    public void Update(PropertyUpdateDTO propertyInfo);
    public Task<IEnumerable<PropertyOwnerDTO>> GetPropertiesAdminAsync();
}