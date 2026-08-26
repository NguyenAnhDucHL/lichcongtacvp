using System.Collections.Generic;
using System.Threading.Tasks;
using LichCongTacVanPhong.Models;

namespace LichCongTacVanPhong.Core.Data.Interfaces
{
    public interface IAdminRepository
    {
        Task<List<Department>> GetDepartmentsAsync();
        Task<int> InsertDepartmentAsync(Department dept);
        Task UpdateDepartmentAsync(Department dept);
        Task DeleteDepartmentAsync(int id);
    }
}
