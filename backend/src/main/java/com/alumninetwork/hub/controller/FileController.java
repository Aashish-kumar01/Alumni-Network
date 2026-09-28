package com.alumninetwork.hub.controller;

import com.alumninetwork.hub.service.FileStorageService;
import com.alumninetwork.hub.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Tag(name = "Files", description = "File upload and download")
public class FileController {

    private final FileStorageService fileStorageService;
    private final UserService userService;

    @PostMapping("/upload/photo")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Map<String, String>> uploadPhoto(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.storeFile(file, "photos");
        Long userId = userService.getCurrentUser().getId();
        userService.updateProfilePhoto(userId, url);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/upload/resume")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Map<String, String>> uploadResume(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.storeFile(file, "resumes");
        Long userId = userService.getCurrentUser().getId();
        userService.updateResume(userId, url);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @GetMapping("/{subfolder}/{filename:.+}")
    public ResponseEntity<Resource> serveFile(
            @PathVariable String subfolder, @PathVariable String filename) throws Exception {
        Path filePath = Paths.get("uploads", subfolder, filename);
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);
    }
}
