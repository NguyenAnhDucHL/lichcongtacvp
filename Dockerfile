# Stage 1: Base - Cài đặt các công cụ hệ thống cần thiết (Dùng chung cho cả Dev và Prod)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS base
WORKDIR /app


# Stage 2: Frontend Build
FROM node:22-alpine AS client-build
WORKDIR /src/LichCongTacVanPhong.Api/ClientApp
COPY ["LichCongTacVanPhong.Api/ClientApp/package.json", "LichCongTacVanPhong.Api/ClientApp/package-lock.json", "./"]
RUN npm install --legacy-peer-deps
COPY ["LichCongTacVanPhong.Api/ClientApp/", "./"]
COPY ["LichCongTacVanPhong.Api/wwwroot/", "../wwwroot/"]
RUN npm run build

# Stage 3: Build
FROM base AS build
WORKDIR /src
COPY ["LichCongTacVanPhong.Api/LichCongTacVanPhong.Api.csproj", "LichCongTacVanPhong.Api/"]
COPY ["LichCongTacVanPhong.Core/LichCongTacVanPhong.Core.csproj", "LichCongTacVanPhong.Core/"]
RUN dotnet restore "LichCongTacVanPhong.Api/LichCongTacVanPhong.Api.csproj" --disable-parallel
COPY . .
COPY --from=client-build /src/LichCongTacVanPhong.Api/wwwroot ./LichCongTacVanPhong.Api/wwwroot
WORKDIR "/src/LichCongTacVanPhong.Api"
RUN dotnet build "LichCongTacVanPhong.Api.csproj" -c Release -o /app/build

# Stage 4: Publish
FROM build AS publish
RUN dotnet publish "LichCongTacVanPhong.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 5: Final Runtime (Sử dụng aspnet để tối ưu dung lượng khi chạy thật)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
# Phải cài lại dependencies vì aspnet image khác với sdk image
RUN apt-get update && apt-get install -y \
    libgdiplus \
    libc6-dev \
    libgomp1 \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*
COPY --from=publish /app/publish .

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "LichCongTacVanPhong.Api.dll"]
