using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Project_2.Models;
using Project_2.Models.DTOs;

namespace Project_2.Data;

public class PropertyRepository : BaseRepository<Property>, IPropertyRepository
{
    private readonly JazaContext _dbContext;

    public PropertyRepository(JazaContext context) : base(context)
    {
        _dbContext = context;
    }

    public async Task<IEnumerable<Property>> GetAllWithFilters(
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
        Guid? OwnerId
    )
    {

        IQueryable<Property> query = _dbContext.Property;

        if (!string.IsNullOrEmpty(country))
            query = query.Where(p => p.Country == country);

        if (!string.IsNullOrEmpty(state))
            query = query.Where(p => p.State == state);

        if (!string.IsNullOrEmpty(city))
            query = query.Where(p => p.City == city);

        if (!string.IsNullOrEmpty(zip))
            query = query.Where(p => p.ZipCode == zip);

        if (!string.IsNullOrEmpty(address))
            query = query.Where(p => p.StreetAddress == address);

        if (priceMax > 0)
            query = query.Where(p => p.StartingPrice <= priceMax);

        if (priceMin >= 0 && priceMin <= priceMax)
            query = query.Where(p => p.StartingPrice >= priceMin);

        if (numBedroom != -1)
            query = query.Where(p => p.Bedrooms == numBedroom);

        if (numBathroom != -1)
            query = query.Where(p => p.Bathrooms == numBathroom);

        if (numGarages != -1)
            query = query.Where(p => p.Garages >= numGarages);

        if (numPools != -1)
            query = query.Where(p => p.Pools >= numPools);

        if (forSale)
            query = query.Where(p => p.ForSale);

        if (hasBasement)
            query = query.Where(p => p.HasBasement);

        if (OwnerId.HasValue)
        {
            query = query.Where(p => p.OwnerID == OwnerId.Value);
        }

        return await query.ToListAsync();
    }

    public async Task<IEnumerable<PropertyResponseDTO>> GetAllWithinDistOf(Guid propertyId, int meters)
    {
        Property? property = _dbContext.Property.Find(propertyId);
        if (property is null)
        {
            return new List<PropertyResponseDTO>();
        }
        return await _dbContext.Property.Where(p => p.Coordinates!.IsWithinDistance(property.Coordinates, meters))
                .OrderBy(p => p.Coordinates.Distance(property.Coordinates!))
                .Select(p => new PropertyResponseDTO(p)).ToListAsync();
    }

    public async Task<IEnumerable<PropertySearchResponseDTO>> GetAllLikeAddress(string addressChars)
    {
        return await _dbContext.Property.Where(p => p.StreetAddress.Contains(addressChars)).Select(p => new PropertySearchResponseDTO(p)).ToListAsync();
    }

    /* Marks an entity as to-be-upserted until its update/insertion into the db
     * in the next SaveChanges() call. 
     * ENSURE that SaveChanges() is called after this, as it has no effect otherwise
     */
    public void Update(PropertyUpdateDTO propertyInfo)
    {
        if (!_dbContext.Property.Any(p => p.PropertyID == propertyInfo.PropertyID))
        {
            throw new Exception("No property found");
        }
        Property property = _dbContext.Property.Find(propertyInfo.PropertyID)!;

        property.Country = propertyInfo.Country ?? property.Country;
        property.State = propertyInfo.State ?? property.State;
        property.City = propertyInfo.City ?? property.City;
        property.ZipCode = propertyInfo.ZipCode ?? property.ZipCode;
        property.StreetAddress = propertyInfo.StreetAddress ?? property.StreetAddress;
        property.StartingPrice = propertyInfo.StartingPrice ?? property.StartingPrice;
        property.Bedrooms = propertyInfo.Bedrooms ?? property.Bedrooms;
        property.Bathrooms = propertyInfo.Bathrooms ?? property.Bathrooms;
        property.Garages = propertyInfo.Garages ?? property.Garages;
        property.Pools = propertyInfo.Pools ?? property.Pools;
        property.ListDate = propertyInfo.ListDate ?? property.ListDate;
        property.OwnerID = propertyInfo.OwnerID ?? property.OwnerID;
        property.StreetAddress = propertyInfo.StreetAddress;
        property.ForSale = propertyInfo.ForSale ?? property.ForSale;
        property.HasBasement = propertyInfo.HasBasement ?? property.HasBasement;

        _dbContext.Property.Update(property);
    }

    public async Task<IEnumerable<PropertyOwnerDTO>> GetPropertiesAdminAsync()
    {
        return await _dbContext.Property
            .Include(p => p.Owner)
            .Select(p => new PropertyOwnerDTO
            {
                PropertyID = p.PropertyID,
                Address = $"{p.StreetAddress}, {p.City}, {p.State} {p.ZipCode}",
                StartingPrice = p.StartingPrice,
                OwnerID = p.OwnerID,
                OwnerEmail = p.Owner.Email,
                OwnerFullName = p.Owner.FullName
            })
            .ToListAsync();
    }



}